import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


// GET — бүх өгөгдөл авах (Engineer)
export async function GET() {
  const batches = await prisma.processingBatch.findMany({
    orderBy: { submittedAt: "desc" },
  });
  return NextResponse.json(batches);
}

// POST — шинэ өгөгдөл хадгалах (Operator)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { deptId, deptName, operator, shift, notes, ...rest } = body;

  const batch = await prisma.processingBatch.create({
    data: {
      deptId,
      deptName,
      operator,
      shift,
      notes: notes ?? "",
      data: rest,
    },
  });
  return NextResponse.json(batch, { status: 201 });
}