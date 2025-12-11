import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/app/lib/jwt";
import { setAuthCookie } from "@/app/lib/cookies";
import { validateEmail, validatePassword } from "@/app/lib/validation";
import { rateLimit } from "@/app/lib/rateLimit";

export async function POST(req: Request) {
  const { email, password_hash } = await req.json();

  // ---------------- Rate Limiting ----------------
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const limit = rateLimit(ip);

  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `Too many attempts. Try again in ${limit.retryAfter} seconds.`,
      },
      { status: 429 }
    );
  }

  // ---------------- Field Validation ----------------
  const errors: Record<string, string | null> = {
    email: validateEmail(email),
    password_hash: validatePassword(password_hash),
  };

  const hasErrors = Object.values(errors).some((err) => err !== null);

  if (hasErrors) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  // ---------------- Check email in Database ----------------
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json(
      {
        errors: {
          email: "Email not found.",
          password_hash: null,
        },
      },
      { status: 404 }
    );
  }

  // ---------------- Verify Password ----------------
  const match = await bcrypt.compare(password_hash, user.password_hash);

  if (!match) {
    return NextResponse.json(
      {
        errors: {
          email: null,
          password_hash: "Password is incorrect.",
        },
      },
      { status: 401 }
    );
  }

  // ---------------- Generate Token + Store Cookie ----------------
  const token = signToken({
    id: user.id,
    full_name: user.email,
    email: user.email,
    phone: user.phone,
    country: user.country,
  });

  await setAuthCookie(token);

  return NextResponse.json(
    { success: true, status: 200, message: "Login successful" },
    { status: 200 }
  );
}
