// app/api/departments/[id]/questions/route.ts
import { prisma } from "@/app/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: "Department id required" }, { status: 400 });
  }

  const questions = await prisma.question.findMany({
    where: { departmentId: id },
    orderBy: { order: "asc" },
  });

  return Response.json(questions);
}
