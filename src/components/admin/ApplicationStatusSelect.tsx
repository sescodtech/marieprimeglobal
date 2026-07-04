"use client";

export function ApplicationStatusSelect({
  currentStatus,
  action,
}: {
  currentStatus: string;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action}>
      <select
        name="status"
        defaultValue={currentStatus}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-md border border-forest-900/15 bg-cream-50 px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider text-ink-700"
      >
        <option value="NEW">New</option>
        <option value="REVIEWED">Reviewed</option>
        <option value="SHORTLISTED">Shortlisted</option>
        <option value="REJECTED">Rejected</option>
      </select>
    </form>
  );
}
