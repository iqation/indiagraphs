// app/api/auth/check-email/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { validateEmail } from "@/app/lib/validation";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailError = validateEmail(email);
    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 400 });
    }

    // Check database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    return NextResponse.json({
      exists: user ? true : false,
      message: user ? "User exists" : "User not exists, please register",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
