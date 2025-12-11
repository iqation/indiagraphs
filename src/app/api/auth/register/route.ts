import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import {
  validateName,
  validateEmail,
  validatePassword,
  validatePhone,
  validateCountry,
} from "@/app/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { full_name, email, password_hash, phone, country, is_active, role } =
      body;

    // Collect validation errors
    const errors: Record<string, string | null> = {
      full_name: validateName(full_name),
      email: validateEmail(email),
      password_hash: validatePassword(password_hash),
      phone: validatePhone ? validatePhone(phone) : null,
      country: validateCountry(country),
    };

    // Check if any validation failed
    const hasErrors = Object.values(errors).some((err) => err !== null);

    if (hasErrors) {
      return NextResponse.json(
        { errors }, // return all errors at once
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { phone: phone.trim() }],
      },
    });
    if (existingUser) {
      const errors: any = {};

      if (existingUser.email === email.toLowerCase()) {
        errors.email = "Email already exists.";
      }

      if (existingUser.phone === phone.trim()) {
        errors.phone = "Phone already exists.";
      }

      return NextResponse.json({ errors }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        full_name: full_name.trim(),
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        phone: phone.trim(),
        country: country,
        role: "USER",
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        country: true,
        is_active: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        status: 201,
        success: true,
        message: "User registered successfully.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
