import { prisma } from "../src/lib/prisma";
import { seedDatabase } from "../src/lib/seedData";

seedDatabase()
  .then((log) => log.forEach((line) => console.log(line)))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
