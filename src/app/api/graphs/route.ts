import { NextResponse } from "next/server";
import { supabaseServer } from "../../lib/supabaseServer";

export async function GET(req: Request) {
  try {


    // 🔒 SECURITY CHECK
  const referer = req.headers.get("referer") || "";
  const origin = req.headers.get("origin") || "";
  const allowedDomains = ["localhost", "indiagraphs.com", "data.indiagraphs.com"];
  const isInternal =
    process.env.NODE_ENV !== "production" ||
    allowedDomains.some(
      (domain) => referer.includes(domain) || origin.includes(domain)
    );
  if (!isInternal) {
    return NextResponse.json(
      { error: "Unauthorized: Direct access not allowed." },
      { status: 403 }
    );
  }
    // Only fetch public fields
    const { data, error } = await supabaseServer
      .from("graphs")
      .select("id, slug, title, description, category, source")
      .order("id", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || [], { status: 200 });
  } catch (err: any) {
    console.error("🔥 /api/graphs error:", err.message);
    return NextResponse.json({ error: "Failed to fetch graphs" }, { status: 500 });
  }
}