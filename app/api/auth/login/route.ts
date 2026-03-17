
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const cookieStore = await cookies();


  const engineer = await prisma.engineer.findUnique({ where: { email } });
  if (!engineer) return Response.json({ error: "Invalid credentials" }, { status: 401 });

  const valid = await bcrypt.compare(password, engineer.passwordHash);
  if (!valid) return Response.json({ error: "Invalid credentials" }, { status: 401 });

  const token = jwt.sign(
    { id: engineer.id, name: engineer.name, email: engineer.email },
    process.env.JWT_SECRET!,
    { expiresIn: "8h" }  // one shift
  );

  cookieStore.set("engineer_token", token, {
    httpOnly: true,   // JS can't read it — prevents XSS theft
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
  });

  return Response.json({ name: engineer.name });
}
