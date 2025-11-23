import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { postId, authorName, authorEmail, content } = await req.json();

    if (!postId || !authorName || !authorEmail || !content) {
      return NextResponse.json(
        { ok: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    // Basic Auth for WP Application Password
    const authString = Buffer.from(
      `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
    ).toString("base64");

    const wpRes = await fetch(
      `${process.env.WP_SITE}/wp-json/wp/v2/comments`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${authString}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: postId,
          author_name: authorName,
          author_email: authorEmail,
          content,
        }),
      }
    );

    const data = await wpRes.json();

    if (!wpRes.ok) {
      return NextResponse.json(
        { ok: false, message: data.message || "WP error" },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, comment: data });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}