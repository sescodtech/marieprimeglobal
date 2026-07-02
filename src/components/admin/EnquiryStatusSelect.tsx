"use client";

import type { EnquiryStatus } from "@prisma/client";

export function EnquiryStatusSelect({
  currentStatus,
  action,
}: {
  currentStatus: EnquiryStatus;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action}>
      <select
        name="status"
        defaultValue={currentStatus}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-stub border border-forest-900/15 bg-cream-100 px-3 py-2 text-xs font-semibold uppercase tracking-wider"
      >
        <option value="NEW">New</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESPONDED">Responded</option>
        <option value="CLOSED">Closed</option>
      </select>
    </form>
  );
}
