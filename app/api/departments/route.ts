// app/api/departments/route.ts
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const departments = await prisma.department.findMany({
    orderBy: { name: "asc" },
  });
  return Response.json(departments);
}
