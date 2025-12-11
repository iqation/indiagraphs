import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Read request body ONCE
    const body = await req.json();
    const { token } = body;

    console.log("tokenm data ==>", token);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Missing token" },
        { status: 400 }
      );
    }

    // Use server-side secret key
    const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { success: false, message: "Missing RECAPTCHA_SECRET_KEY" },
        { status: 500 }
      );
    }

    // Prepare request for Google reCAPTCHA verification
    const params = new URLSearchParams();
    params.append("secret", secretKey);
    params.append("response", token);

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const data = await response.json();

    console.log("data data ==>", data, "responseresponse ==>", response);

    return NextResponse.json({
      success: data.success,
      score: data.score,
      action: data.action,
      message: data["error-codes"] ?? null,
    });
  } catch (error: any) {
    console.error("reCAPTCHA verification error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
