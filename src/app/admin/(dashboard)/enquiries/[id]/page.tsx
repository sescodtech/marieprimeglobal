import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { changeEnquiryStatus, updateEnquiryNote, assignEnquiryStaff } from "@/lib/actions/enquiries";
import { EnquiryStatusSelect } from "@/components/admin/EnquiryStatusSelect";
import { StaffAssignSelect } from "@/components/admin/StaffAssignSelect";
import { AddEnquiryNoteForm } from "@/components/admin/AddEnquiryNoteForm";

const serviceLabels: Record<string, string> = {
  FLIGHT_BOOKING: "Flight Booking & Travel Solutions",
  VISA_IMMIGRATION: "Visa & Immigration Assistance",
  TRAVEL_LOAN: "Travel Loan Assistance",
  STUDY_ABROAD: "Study Abroad Support",
  BUSINESS_REGISTRATION: "Business Registration Services",
  GENERAL_ENQUIRY: "General Enquiry",
};

export default async function EnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, PERMISSIONS.MANAGE_ENQUIRIES)) {
    redirect("/admin?error=unauthorized");
  }

  const { id } = await params;
  const enquiry = await prisma.enquiry.findUnique({
    where: { id },
    include: {
      assignedStaff: { select: { name: true } },
      notes: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!enquiry) notFound();

  const canAssignStaff = hasPermission(session.user.role, PERMISSIONS.ASSIGN_STAFF);
  const staffOptions = canAssignStaff
    ? (
        await prisma.admin.findMany({
          where: { role: { in: ["SUPER_ADMIN", "ADMIN", "STAFF"] }, status: "ACTIVE" },
          orderBy: { name: "asc" },
          select: { id: true, name: true, role: true },
        })
      ).map((s) => ({ id: s.id, name: s.name, role: s.role }))
    : [];

  const changeStatus = changeEnquiryStatus.bind(null, id);
  const saveNote = updateEnquiryNote.bind(null, id);

  return (
    <div className="max-w-2xl">
      <Link href="/admin/enquiries" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-forest-700">
        <ArrowLeft size={15} />
        Back to enquiries
      </Link>

      <div className="mt-6 rounded-stub bg-cream-50 p-5 shadow-card ring-1 ring-forest-900/5 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-forest-900">{enquiry.fullName}</h1>
            <p className="mt-1 text-sm text-ink-500">
              {serviceLabels[enquiry.serviceInterest]} · Submitted {format(enquiry.createdAt, "MMM d, yyyy 'at' h:mm a")}
            </p>
            {enquiry.subject && <p className="mt-1 text-sm font-medium text-forest-900">{enquiry.subject}</p>}
          </div>
          <EnquiryStatusSelect currentStatus={enquiry.status} action={changeStatus} />
        </div>

        <div className="mt-6 flex flex-wrap gap-6 text-sm">
          <a href={`mailto:${enquiry.email}`} className="flex items-center gap-2 text-forest-700 hover:underline">
            <Mail size={15} />
            {enquiry.email}
          </a>
          <a href={`tel:${enquiry.phone}`} className="flex items-center gap-2 text-forest-700 hover:underline">
            <Phone size={15} />
            {enquiry.phone}
          </a>
        </div>

        {canAssignStaff && (
          <div className="mt-6 border-t border-forest-900/10 pt-6">
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
              Assigned staff
            </label>
            <StaffAssignSelect
              entityId={id}
              currentStaffId={enquiry.assignedStaffId}
              staffOptions={staffOptions}
              onAssign={assignEnquiryStaff}
            />
          </div>
        )}

        <div className="mt-6 border-t border-forest-900/10 pt-6">
          <h2 className="font-mono text-xs uppercase tracking-wider text-ink-500">Message</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
            {enquiry.message}
          </p>
        </div>

        <div className="mt-6 border-t border-forest-900/10 pt-6">
          <h2 className="font-mono text-xs uppercase tracking-wider text-ink-500">Internal notes</h2>
          <div className="mt-3 space-y-3">
            {enquiry.notes.length === 0 && <p className="text-sm text-ink-500">No notes yet.</p>}
            {enquiry.notes.map((note) => (
              <div key={note.id} className="rounded-stub bg-cream-100 p-3">
                <p className="text-sm text-forest-900">{note.body}</p>
                <p className="mt-1 text-xs text-ink-500">
                  {note.authorName} · {format(note.createdAt, "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <AddEnquiryNoteForm enquiryId={id} />
          </div>
        </div>

        {enquiry.adminNote && (
          <div className="mt-6 border-t border-forest-900/10 pt-6">
            <h2 className="font-mono text-xs uppercase tracking-wider text-ink-500">
              Legacy note (from before notes history)
            </h2>
            <form action={saveNote} className="mt-2">
              <textarea
                name="adminNote"
                defaultValue={enquiry.adminNote ?? ""}
                rows={2}
                className="w-full rounded-stub border border-forest-900/15 bg-cream-100 px-3.5 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
              />
              <button
                type="submit"
                className="mt-3 rounded-stub border border-forest-700/25 px-5 py-2 text-xs font-semibold text-forest-700 hover:border-forest-700"
              >
                Save
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
