"use server";

import { requireAdmin } from "@/lib/actions/require-admin";
import { revalidatePath } from "next/cache";
import type { ApplicationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function updateApplicationStatus(id: string, formData: FormData) {
  await requireAdmin();
  const status = formData.get("status") as ApplicationStatus;
  await prisma.jobApplication.update({ where: { id }, data: { status } });
  revalidatePath("/admin/careers/applications");
}

export async function deleteApplication(id: string) {
  await requireAdmin();
  await prisma.jobApplication.delete({ where: { id } });
  revalidatePath("/admin/careers/applications");
}
