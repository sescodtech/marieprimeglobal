"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export function ReportExportForm({ reportTypes }: { reportTypes: { value: string; label: string }[] }) {
  const [type, setType] = useState(reportTypes[0]?.value ?? "applications");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  function buildUrl(format: "csv" | "xlsx" | "pdf") {
    const params = new URLSearchParams({ type, format });
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    return `/api/admin/reports?${params.toString()}`;
  }

  const showDateFilter = type === "applications" || type === "enquiries";

  return (
    <div className="space-y-5">
      <label className="block">
        <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">Report</span>
        <select value={type} onChange={(e) => setType(e.target.value)} className="input">
          {reportTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      {showDateFilter && (
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">From (optional)</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">To (optional)</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="input" />
          </label>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <a
          href={buildUrl("csv")}
          className="inline-flex items-center gap-2 rounded-stub bg-forest-700 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800"
        >
          <Download size={15} />
          Export CSV
        </a>
        <a
          href={buildUrl("xlsx")}
          className="inline-flex items-center gap-2 rounded-stub border border-forest-700/25 px-5 py-2.5 text-sm font-semibold text-forest-700 hover:border-forest-700"
        >
          <Download size={15} />
          Export Excel
        </a>
        <a
          href={buildUrl("pdf")}
          className="inline-flex items-center gap-2 rounded-stub border border-forest-700/25 px-5 py-2.5 text-sm font-semibold text-forest-700 hover:border-forest-700"
        >
          <Download size={15} />
          Export PDF
        </a>
      </div>
    </div>
  );
}
