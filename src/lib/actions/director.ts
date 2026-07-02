"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  position: z.string().min(2),
  biography: z.string().min(10),
  photoUrl: z.string().optional(),
});

export async function updateDirectorProfile(formData: FormData) {
  const data = schema.parse({
    name: formData.get("name"),
    position: formData.get("position"),
    biography: formData.get("biography"),
    photoUrl: formData.get("photoUrl") || undefined,
  });

  const existing = await prisma.directorProfile.findFirst({ where: { isActive: true } });

  if (existing) {
    await prisma.directorProfile.update({ where: { id: existing.id }, data });
  } else {
    await prisma.directorProfile.create({ data: { ...data, isActive: true } });
  }

  revalidatePath("/admin/director");
  revalidatePath("/about");
}
