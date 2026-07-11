import { requirePermission } from "@/lib/actions/require-admin";
import { PERMISSIONS } from "@/lib/permissions";
import { ReportExportForm } from "@/components/admin/ReportExportForm";

const REPORT_TYPES = [
  { value: "applications", label: "Applications" },
  { value: "enquiries", label: "Enquiries" },
  { value: "services", label: "Services" },
  { value: "staff-performance", label: "Staff Performance" },
];

export default async function ReportsPage() {
  await requirePermission(PERMISSIONS.VIEW_REPORTS);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-900">Reports</h1>
      <p className="mt-1 text-sm text-ink-500">Export data as CSV or Excel, optionally filtered by date.</p>

      <div className="mt-8 max-w-xl rounded-stub bg-cream-50 p-6 shadow-card ring-1 ring-forest-900/5 sm:p-8">
        <ReportExportForm reportTypes={REPORT_TYPES} />
      </div>
    </div>
  );
}
