"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 rounded-stub border border-forest-700/25 px-4 py-2 text-xs font-semibold text-forest-700 hover:border-forest-700 print:hidden"
    >
      <Printer size={14} />
      Print
    </button>
  );
}
