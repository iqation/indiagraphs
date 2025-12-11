import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "Email not found." }, { status: 404 });
  }

  //   if (user.email_verified) {
  //     return NextResponse.json(
  //       { message: "Email already verified." },
  //       { status: 200 }
  //     );
  //   }

  // Generate token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  //   await prisma.user.update({
  //     where: { email },
  //     data: {
  //     //   verification_token: token,
  //     //   verification_expires: expires,
  //     },
  //   });

  // Create verification link
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${token}`;

  // 👉 SEND EMAIL (example console output)
  console.log("Verification Email URL:", verifyUrl);

  return NextResponse.json({
    success: true,
    message: "Verification email sent.",
  });
}
