"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { EnquiryStatus } from "@prisma/client";

export async function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  await prisma.enquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
}

export async function changeEnquiryStatus(id: string, formData: FormData) {
  const status = formData.get("status") as EnquiryStatus;
  await prisma.enquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
}

export async function updateEnquiryNote(id: string, formData: FormData) {
  const adminNote = String(formData.get("adminNote") || "");
  await prisma.enquiry.update({ where: { id }, data: { adminNote } });
  revalidatePath(`/admin/enquiries/${id}`);
}
