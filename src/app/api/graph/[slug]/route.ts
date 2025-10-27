import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabaseServer";

// ✅ Secure API route to fetch graph + dataset + datapoints
export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // ✅ Step 1: Allow only internal requests
    const referer = req.headers.get("referer") || "";
    const origin = req.headers.get("origin") || "";
    const allowedDomains = [
      "localhost",
      "indiagraphs.com",
      "data.indiagraphs.com",
    ];

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

    // ✅ Step 2: Get slug from dynamic params
    const { slug } = await context.params;

    // ✅ Step 3: Fetch graph + nested datasets + datapoints
    const { data, error } = await supabaseServer
      .from("graphs")
      .select(`
        id, slug, title, description, category, source,
        datasets (
          id, name, color, unit, metric_type, metric_behavior, allow_latest_value,
          data_points (
            period_label, value, period_start, period_end
          )
        )
      `)
      .eq("slug", slug)
      // ✅ Force chronological order for nested data
      .order("period_start", {
        referencedTable: "datasets.data_points",
        ascending: true,
      })
      .single();

    // ❌ Handle errors
    if (error || !data) {
      console.error("❌ Supabase fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch graph data." },
        { status: 500 }
      );
    }

    // ✅ Step 4: Clean / minimize payload before sending
    const safeData = {
      id: data.id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      category: data.category,
      source: data.source,
      datasets: data.datasets?.map((d: any) => ({
        id: d.id,
        name: d.name,
        color: d.color,
        unit: d.unit,
        metric_type: d.metric_type,
        metric_behavior: d.metric_behavior,
        allow_latest_value: d.allow_latest_value,
        data_points: d.data_points?.map((p: any) => ({
          period_label: p.period_label,
          value: p.value,
          period_start: p.period_start,
          period_end: p.period_end,
        })),
      })),
    };

    // ✅ Step 5: Return cached success response
    return NextResponse.json(safeData, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60",
      },
    });
  } catch (err: any) {
    // ❌ No caching for errors
    console.error("🔥 Server error in /graphs/[slug]:", err.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}