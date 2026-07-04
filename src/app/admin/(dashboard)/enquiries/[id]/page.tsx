import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { changeEnquiryStatus, updateEnquiryNote } from "@/lib/actions/enquiries";
import { EnquiryStatusSelect } from "@/components/admin/EnquiryStatusSelect";

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
  const { id } = await params;
  const enquiry = await prisma.enquiry.findUnique({ where: { id } });
  if (!enquiry) notFound();

  const changeStatus = changeEnquiryStatus.bind(null, id);
  const saveNote = updateEnquiryNote.bind(null, id);

  return (
    <div className="max-w-2xl">
      <Link href="/admin/enquiries" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-forest-700">
        <ArrowLeft size={15} />
        Back to enquiries
      </Link>

      <div className="mt-6 rounded-stub bg-cream-50 p-8 shadow-card ring-1 ring-forest-900/5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-forest-900">{enquiry.fullName}</h1>
            <p className="mt-1 text-sm text-ink-500">
              {serviceLabels[enquiry.serviceInterest]} · Submitted {format(enquiry.createdAt, "MMM d, yyyy 'at' h:mm a")}
            </p>
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

        <div className="mt-6 border-t border-forest-900/10 pt-6">
          <h2 className="font-mono text-xs uppercase tracking-wider text-ink-500">Message</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
            {enquiry.message}
          </p>
        </div>

        <form action={saveNote} className="mt-6 border-t border-forest-900/10 pt-6">
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
            Internal note (not visible to the client)
          </label>
          <textarea
            name="adminNote"
            defaultValue={enquiry.adminNote ?? ""}
            rows={3}
            className="w-full rounded-stub border border-forest-900/15 bg-cream-100 px-3.5 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
            placeholder="e.g. Sent visa checklist on 3 July, awaiting documents."
          />
          <button
            type="submit"
            className="mt-3 rounded-stub bg-forest-700 px-5 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-800"
          >
            Save note
          </button>
        </form>
      </div>
    </div>
  );
}
