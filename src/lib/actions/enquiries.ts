"use server";

import { revalidatePath } from "next/cache";
import type { EnquiryStatus } from "@prisma/client";
import { requirePermission } from "@/lib/actions/require-admin";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import { createNotification } from "@/lib/notifications";

async function requireEnquiryAccess() {
  return requirePermission(PERMISSIONS.MANAGE_ENQUIRIES);
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  const actor = await requireEnquiryAccess();
  const enquiry = await prisma.enquiry.update({ where: { id }, data: { status } });
  await logAudit({
    actor,
    action: "ENQUIRY_STATUS_CHANGED",
    entityType: "Enquiry",
    entityId: id,
    description: `${actor.name} changed ${enquiry.fullName}'s enquiry status to ${status}.`,
  });

  if (status === "CLOSED" && enquiry.assignedStaffId && enquiry.assignedStaffId !== actor.id) {
    void createNotification({
      recipientAdminId: enquiry.assignedStaffId,
      title: "Enquiry closed",
      body: `${enquiry.fullName}'s enquiry has been closed.`,
      link: `/admin/enquiries/${id}`,
      category: "ENQUIRIES",
    });
  }

  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
}

export async function changeEnquiryStatus(id: string, formData: FormData) {
  const status = formData.get("status") as EnquiryStatus;
  await updateEnquiryStatus(id, status);
}

/** Legacy single-note field — kept working for any old data, but new UI
 *  writes to EnquiryNote via addEnquiryNote instead. */
export async function updateEnquiryNote(id: string, formData: FormData) {
  const actor = await requireEnquiryAccess();
  const adminNote = String(formData.get("adminNote") || "");
  await prisma.enquiry.update({ where: { id }, data: { adminNote } });
  await logAudit({
    actor,
    action: "ENQUIRY_NOTE_UPDATED",
    entityType: "Enquiry",
    entityId: id,
    description: `${actor.name} updated the note on an enquiry.`,
  });
  revalidatePath(`/admin/enquiries/${id}`);
}

type FormState = { error?: string; success?: boolean };

export async function addEnquiryNote(id: string, _prevState: FormState, formData: FormData): Promise<FormState> {
  const actor = await requireEnquiryAccess();
  const body = String(formData.get("body") || "").trim();
  if (!body) return { error: "Note can't be empty." };

  const enquiry = await prisma.enquiry.findUnique({ where: { id } });
  if (!enquiry) return { error: "That enquiry no longer exists." };

  await prisma.enquiryNote.create({
    data: { enquiryId: id, authorId: actor.id, authorName: actor.name, body },
  });

  await logAudit({
    actor,
    action: "ENQUIRY_NOTE_ADDED",
    entityType: "Enquiry",
    entityId: id,
    description: `${actor.name} added a note to ${enquiry.fullName}'s enquiry.`,
  });

  revalidatePath(`/admin/enquiries/${id}`);
  return { success: true };
}

export async function assignEnquiryStaff(id: string, staffId: string) {
  const actor = await requirePermission(PERMISSIONS.ASSIGN_STAFF);
  const enquiry = await prisma.enquiry.findUnique({ where: { id } });
  if (!enquiry) return;

  const nextStaffId = staffId || null;
  let staffName = "Unassigned";
  if (nextStaffId) {
    const staff = await prisma.admin.findUnique({ where: { id: nextStaffId } });
    if (!staff) return;
    staffName = staff.name;
    void createNotification({
      recipientAdminId: staff.id,
      title: "Enquiry assigned to you",
      body: `${enquiry.fullName}'s enquiry was assigned to you by ${actor.name}.`,
      link: `/admin/enquiries/${id}`,
      category: "ENQUIRIES",
    });
  }

  await prisma.enquiry.update({ where: { id }, data: { assignedStaffId: nextStaffId } });

  await logAudit({
    actor,
    action: "ENQUIRY_ASSIGNED",
    entityType: "Enquiry",
    entityId: id,
    description: `${actor.name} assigned ${enquiry.fullName}'s enquiry to ${staffName}.`,
  });

  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
}
