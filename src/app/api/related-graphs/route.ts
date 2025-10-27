import { NextResponse } from "next/server";
import { supabaseServer } from "../../lib/supabaseServer";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");

    if (!category) {
      return NextResponse.json({ error: "Missing category" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("graphs")
      .select("title, slug")
      .eq("category", category)
      .neq("slug", slug)
      .limit(4);

    if (error) throw error;

    return NextResponse.json(data || [], { status: 200 });
  } catch (err: any) {
    console.error("❌ Related Graphs API error:", err.message);
    return NextResponse.json({ error: "Failed to load related graphs" }, { status: 500 });
  }
}