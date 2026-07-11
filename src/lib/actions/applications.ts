"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requirePermission } from "@/lib/actions/require-admin";
import { logAudit } from "@/lib/audit";
import { PERMISSIONS } from "@/lib/permissions";
import { STATUS_LABELS, TERMINAL_STATUSES } from "@/lib/applicationForms/status";
import { sendApplicationStatusUpdateEmail } from "@/lib/email";
import { createNotification } from "@/lib/notifications";

const STATUS_VALUES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "ADDITIONAL_DOCS_REQUIRED",
  "DOCUMENTS_RECEIVED",
  "PROCESSING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
] as const;
const statusSchema = z.enum(STATUS_VALUES);

type FormState = { error?: string; success?: boolean };

function applicationPath(id: string) {
  return `/admin/applications/${id}`;
}

/**
 * Staff (VIEW_ASSIGNED_APPLICATIONS only, no REVIEW_APPLICATIONS) may only
 * touch applications assigned to them, and can't move a status to a terminal
 * one — approving/rejecting/completing stays an Admin/Super Admin action,
 * matching the Phase 1 role spec.
 */
async function requireApplicationAccess(id: string, options: { forTerminalChange?: boolean } = {}) {
  const actor = await requireAdmin();
  const canReviewAll = actor.role === "SUPER_ADMIN" || actor.role === "ADMIN";

  const application = await prisma.serviceApplication.findUnique({ where: { id } });
  if (!application) {
    return { actor, application: null as null, allowed: false };
  }

  if (canReviewAll) {
    return { actor, application, allowed: true };
  }

  const isAssigned = application.assignedStaffId === actor.id;
  const allowed = isAssigned && !options.forTerminalChange;
  return { actor, application, allowed };
}

export async function updateApplicationStatus(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsedStatus = statusSchema.safeParse(formData.get("status"));
  if (!parsedStatus.success) {
    return { error: "Please choose a valid status." };
  }

  const isTerminal = (TERMINAL_STATUSES as string[]).includes(parsedStatus.data);
  const { actor, application, allowed } = await requireApplicationAccess(id, { forTerminalChange: isTerminal });
  if (!application) return { error: "That application no longer exists." };
  if (!allowed) return { error: "You don't have permission to make this change." };

  const rawNote = formData.get("note");
  const noteText = typeof rawNote === "string" && rawNote.trim() ? rawNote.trim() : null;

  await prisma.$transaction([
    prisma.serviceApplication.update({ where: { id }, data: { status: parsedStatus.data } }),
    prisma.applicationStatusEvent.create({
      data: { applicationId: id, status: parsedStatus.data, note: noteText, actorName: actor.name },
    }),
  ]);

  await logAudit({
    actor,
    action: "APPLICATION_STATUS_CHANGED",
    entityType: "ServiceApplication",
    entityId: id,
    description: `${actor.name} changed ${application.referenceNumber}'s status from ${application.status} to ${parsedStatus.data}.`,
  });

  void sendApplicationStatusUpdateEmail({
    referenceNumber: application.referenceNumber,
    applicantName: application.applicantName,
    applicantEmail: application.applicantEmail,
    serviceTitle: application.serviceTitle,
    statusLabel: STATUS_LABELS[parsedStatus.data],
    note: noteText,
  });

  if (application.assignedStaffId && application.assignedStaffId !== actor.id) {
    void createNotification({
      recipientAdminId: application.assignedStaffId,
      title: "Application status changed",
      body: `${application.referenceNumber} is now "${STATUS_LABELS[parsedStatus.data]}".`,
      link: applicationPath(id),
    });
  }

  revalidatePath(applicationPath(id));
  revalidatePath("/admin/applications");
  return { success: true };
}

export async function requestAdditionalDocuments(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawNote = formData.get("note");
  const noteText = typeof rawNote === "string" ? rawNote.trim() : "";
  if (!noteText) {
    return { error: "Describe what additional documents are needed." };
  }

  const actor = await requirePermission(PERMISSIONS.REVIEW_APPLICATIONS);
  const application = await prisma.serviceApplication.findUnique({ where: { id } });
  if (!application) return { error: "That application no longer exists." };

  await prisma.$transaction([
    prisma.serviceApplication.update({ where: { id }, data: { status: "ADDITIONAL_DOCS_REQUIRED" } }),
    prisma.applicationStatusEvent.create({
      data: { applicationId: id, status: "ADDITIONAL_DOCS_REQUIRED", note: noteText, actorName: actor.name },
    }),
  ]);

  await logAudit({
    actor,
    action: "APPLICATION_DOCS_REQUESTED",
    entityType: "ServiceApplication",
    entityId: id,
    description: `${actor.name} requested additional documents for ${application.referenceNumber}: ${noteText}`,
  });

  void sendApplicationStatusUpdateEmail({
    referenceNumber: application.referenceNumber,
    applicantName: application.applicantName,
    applicantEmail: application.applicantEmail,
    serviceTitle: application.serviceTitle,
    statusLabel: STATUS_LABELS.ADDITIONAL_DOCS_REQUIRED,
    note: noteText,
  });

  revalidatePath(applicationPath(id));
  revalidatePath("/admin/applications");
  return { success: true };
}

/** Admin/Super Admin only — assigns (or unassigns, with an empty value) the
 *  application to a Staff or Admin account. */
export async function assignStaff(id: string, staffId: string) {
  const actor = await requirePermission(PERMISSIONS.ASSIGN_STAFF);
  const application = await prisma.serviceApplication.findUnique({ where: { id } });
  if (!application) return;

  const nextStaffId = staffId || null;
  let staffName = "Unassigned";
  if (nextStaffId) {
    const staff = await prisma.admin.findUnique({ where: { id: nextStaffId } });
    if (!staff) return;
    staffName = staff.name;
  }

  await prisma.$transaction([
    prisma.serviceApplication.update({ where: { id }, data: { assignedStaffId: nextStaffId } }),
    prisma.applicationStatusEvent.create({
      data: {
        applicationId: id,
        status: application.status,
        note: `Assigned to ${staffName}.`,
        actorName: actor.name,
      },
    }),
  ]);

  if (nextStaffId) {
    void createNotification({
      recipientAdminId: nextStaffId,
      title: "Application assigned to you",
      body: `${application.referenceNumber} (${application.serviceTitle}) was assigned to you by ${actor.name}.`,
      link: applicationPath(id),
    });
  }

  await logAudit({
    actor,
    action: "APPLICATION_ASSIGNED",
    entityType: "ServiceApplication",
    entityId: id,
    description: `${actor.name} assigned ${application.referenceNumber} to ${staffName}.`,
  });

  revalidatePath(applicationPath(id));
  revalidatePath("/admin/applications");
}

const noteSchema = z.object({
  body: z.string().trim().min(1, "Note can't be empty."),
  isPublic: z.boolean().optional(),
});

export async function addApplicationNote(id: string, _prevState: FormState, formData: FormData): Promise<FormState> {
  const { actor, application, allowed } = await requireApplicationAccess(id);
  if (!application) return { error: "That application no longer exists." };
  if (!allowed) return { error: "You don't have permission to add notes to this application." };

  const parsed = noteSchema.safeParse({
    body: formData.get("body"),
    isPublic: formData.get("isPublic") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please write a note." };
  }

  await prisma.applicationNote.create({
    data: {
      applicationId: id,
      authorId: actor.id,
      authorName: actor.name,
      body: parsed.data.body,
      isPublic: Boolean(parsed.data.isPublic),
    },
  });

  await logAudit({
    actor,
    action: "APPLICATION_NOTE_ADDED",
    entityType: "ServiceApplication",
    entityId: id,
    description: `${actor.name} added a${parsed.data.isPublic ? " public" : "n internal"} note to ${application.referenceNumber}.`,
  });

  revalidatePath(applicationPath(id));
  return { success: true };
}
