"use client";

import { useTransition } from "react";

export function StaffAssignSelect({
  entityId,
  currentStaffId,
  staffOptions,
  onAssign,
}: {
  entityId: string;
  currentStaffId: string | null;
  staffOptions: { id: string; name: string; role: string }[];
  onAssign: (entityId: string, staffId: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={currentStaffId ?? ""}
      disabled={isPending}
      onChange={(e) => startTransition(() => onAssign(entityId, e.target.value))}
      className="input disabled:opacity-60"
    >
      <option value="">Unassigned</option>
      {staffOptions.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name} ({s.role === "SUPER_ADMIN" ? "Super Admin" : s.role === "ADMIN" ? "Admin" : "Staff"})
        </option>
      ))}
    </select>
  );
}
