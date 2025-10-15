// src/app/api/layout/route.ts
import { NextResponse } from "next/server";

// ✅ API route to fetch the WordPress header & footer layout
export async function GET() {
  try {
    // Dynamically use your live or local WP API endpoint
    const WP_API_URL =
      process.env.WP_LAYOUT_API_URL ||
      "https://indiagraphs.com/wp-json/indiagraphs/v1/layout";

    // Fetch with cache (1-hour revalidation)
    const res = await fetch(WP_API_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch layout: ${res.status}`);
    }

    const data = await res.json();

    // Return the WordPress layout JSON to Next.js
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("❌ Layout fetch error:", error.message);

    // Graceful fallback so your app never breaks
    return NextResponse.json(
      {
        header: "",
        footer: "",
        error: "Layout unavailable — fallback to blank layout",
      },
      { status: 200 }
    );
  }
}