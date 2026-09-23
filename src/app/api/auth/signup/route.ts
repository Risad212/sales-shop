import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getDb } from "@/lib/db";

const SignupSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    const parsed = SignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid name, email or password (min 6 chars)" }, { status: 400 });
    }
    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
    }
    const email = parsed.data.email.toLowerCase();
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await db.user.create({
      data: { name: parsed.data.name, email, passwordHash, role: "customer" },
    });
    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) {
    console.error("POST /api/auth/signup failed:", error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
