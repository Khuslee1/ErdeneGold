// app/api/submissions/route.ts
import { prisma } from "@/app/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const deptId = searchParams.get("deptId");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const start = dateFrom ? new Date(dateFrom) : new Date();
  start.setHours(0, 0, 0, 0);

  const end = dateTo ? new Date(dateTo) : new Date(start);
  end.setHours(23, 59, 59, 999);

  const submissions = await prisma.submission.findMany({
    where: {
      ...(deptId ? { departmentId: deptId } : {}),
      submittedAt: { gte: start, lte: end },
    },
    include: { department: true },
    orderBy: [{ submittedAt: "asc" }, { hour: "asc" }],
  });

  return Response.json(submissions);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { operatorName, shift, hour, departmentId, answers } = body;

  const submission = await prisma.submission.create({
    data: { operatorName, shift, hour, departmentId, answers },
  });

  return Response.json(submission, { status: 201 });
}
