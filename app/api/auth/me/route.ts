import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("engineer_token")?.value;
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      name: string;
      email: string;
    };
    return Response.json({ name: payload.name, email: payload.email });
  } catch {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
}
