import { prisma } from "@/lib/prisma";

/**
 * Generates the next reference number for the current year, e.g.
 * "MPG-2026-000001". Uses an upsert whose update branch does an atomic
 * `increment`, so concurrent submissions can never receive the same number.
 *
 * The upsert itself isn't perfectly race-proof the very first time a new
 * year's row is created (two requests could both attempt to `create` at
 * once), so on a unique-constraint violation we simply retry once — by then
 * the row exists and the plain `increment` path is used.
 */
export async function generateReferenceNumber(): Promise<string> {
  const year = new Date().getFullYear();

  let counter;
  try {
    counter = await prisma.referenceCounter.upsert({
      where: { year },
      create: { year, count: 1 },
      update: { count: { increment: 1 } },
    });
  } catch (error) {
    // P2002 = unique constraint violation — another request created the
    // row for this year in the same instant. Retry as a plain increment.
    counter = await prisma.referenceCounter.update({
      where: { year },
      data: { count: { increment: 1 } },
    });
    void error;
  }

  const padded = String(counter.count).padStart(6, "0");
  return `MPG-${year}-${padded}`;
}
