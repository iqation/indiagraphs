import { NextResponse } from "next/server";

const WP_URL = "https://cms.indiagraphs.com/wp-json/wp/v2/comments";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const res = await fetch(WP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || "Comment failed" }, { status: 400 });
    }

    return NextResponse.json({ success: true, comment: data });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}