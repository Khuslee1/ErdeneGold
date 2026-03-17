// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.engineer.createMany({
    data: [
      { name: "Б. Батжаргал", email: "bat@mine.mn",  passwordHash: await bcrypt.hash("password123", 10) },
      { name: "Э. Оюунбаяр", email: "oyun@mine.mn", passwordHash: await bcrypt.hash("password456", 10) },
    ],
  });
  console.log("✓ Engineers seeded");
}

main().catch(console.error).finally(() => prisma.$disconnect());