"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Permission } from "@/lib/permissions";
import { PERMISSION_GROUPS } from "@/lib/permissions";

export function PermissionsEditor({
  userId,
  initialPermissions,
  onSave,
}: {
  userId: string;
  initialPermissions: Permission[];
  onSave: (id: string, permissions: string[]) => Promise<void>;
}) {
  const [selected, setSelected] = useState<Set<Permission>>(new Set(initialPermissions));
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  function toggle(permission: Permission) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(permission)) next.delete(permission);
      else next.add(permission);
      return next;
    });
    setSaved(false);
  }

  function toggleGroup(group: (typeof PERMISSION_GROUPS)[number]) {
    const allSelected = group.permissions.every((p) => selected.has(p.key));
    setSelected((prev) => {
      const next = new Set(prev);
      group.permissions.forEach((p) => (allSelected ? next.delete(p.key) : next.add(p.key)));
      return next;
    });
    setSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      await onSave(userId, Array.from(selected));
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="space-y-6">
        {PERMISSION_GROUPS.map((group) => {
          const allSelected = group.permissions.every((p) => selected.has(p.key));
          return (
            <div key={group.label} className="rounded-stub bg-cream-100 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600">{group.label}</h3>
                <button
                  type="button"
                  onClick={() => toggleGroup(group)}
                  className="text-xs font-medium text-forest-700 hover:underline"
                >
                  {allSelected ? "Deselect all" : "Select all"}
                </button>
              </div>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {group.permissions.map((p) => (
                  <label key={p.key} className="flex items-center gap-2 text-sm text-ink-700">
                    <input
                      type="checkbox"
                      checked={selected.has(p.key)}
                      onChange={() => toggle(p.key)}
                      className="h-4 w-4 rounded border-forest-900/30 text-forest-700"
                    />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="rounded-stub bg-forest-700 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-800 disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save permissions"}
        </button>
        {saved && !isPending && <span className="text-sm text-forest-700">Saved — takes effect immediately.</span>}
      </div>
    </div>
  );
}
