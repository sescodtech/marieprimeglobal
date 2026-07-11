"use client";

import { useTransition } from "react";
import { assignStaff } from "@/lib/actions/applications";

export function AssignStaffSelect({
  applicationId,
  currentStaffId,
  staffOptions,
}: {
  applicationId: string;
  currentStaffId: string | null;
  staffOptions: { id: string; name: string; role: string }[];
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={currentStaffId ?? ""}
      disabled={isPending}
      onChange={(e) => startTransition(() => assignStaff(applicationId, e.target.value))}
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
