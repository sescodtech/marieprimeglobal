"use client";

import { useState } from "react";

export function ForgotPasswordLink() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-sm font-medium text-forest-700 hover:underline"
      >
        Forgot password?
      </button>
      {open && (
        <div className="absolute right-0 top-full z-10 mt-2 w-56 rounded-stub border border-forest-900/10 bg-cream-50 p-3 text-xs leading-relaxed text-ink-500 shadow-stub">
          Self-service reset isn&apos;t available yet. Contact the site administrator directly
          to have your password reset.
        </div>
      )}
    </div>
  );
}
