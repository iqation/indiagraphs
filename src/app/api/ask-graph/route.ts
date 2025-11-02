import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { graph } = await req.json();
    const { title, category, datasets } = graph;
    const dataset = datasets?.[0];
    const points = dataset?.data_points || [];
    const unit = dataset?.unit || "";

    // ✅ Sort datapoints chronologically
    function extractYear(label: string): number {
      if (!label) return 0;
      const years = label.match(/\d{4}/g)?.map(Number);
      if (years?.length) return Math.max(...years);
      const fyMatch = label.match(/FY\s?(\d{2})/i);
      if (fyMatch) {
        const yr = parseInt(fyMatch[1]);
        return yr < 50 ? 2000 + yr : 1900 + yr;
      }
      return 0;
    }

    const sortedPoints = [...points].sort(
      (a, b) => extractYear(a.period_label) - extractYear(b.period_label)
    );

    // ✅ Build summary
    const summary = sortedPoints
      .slice(-40)
      .map((p: any) => `${p.period_label}: ${p.value}`)
      .join(", ");

    // ✅ Improved prompt — includes unit & anti-hallucination rules
    const prompt = `
You are Indiagraphs’ data insight analyst.
You write short, factual explanations of Indian public datasets.

TASK:
Explain what this dataset shows — in 2–3 concise, neutral sentences (<50 words).
Your answer must be purely data-driven, using the provided data and unit.

DATA:
Title: ${title}
Category: ${category}
Unit: ${unit || "Not specified"}
Recent values (oldest → latest): ${summary}

RULES:
- The last value represents the most recent year — treat it as the latest point.
- Always report values using the provided unit (“${unit}”) exactly as written.
- Do NOT assume or convert to USD, million, billion, or any other unit.
- Focus only on visible data, not predictions or external causes.
- Mention direction of change (rising / falling / stable) and first vs latest value.
- If the dataset is short (<5 points), say “shows limited variation over time.”
- Keep tone factual, professional, and simple enough for general readers.

Example output:
Between 1991 and 2025, India’s gross external debt rose from ₹163,001 crore to ₹6,303,630 crore, showing a steady upward trend with faster growth after 2008.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 180,
    });

    const answer = completion.choices[0]?.message?.content?.trim();
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("ask-graph error:", err);
    return NextResponse.json(
      { error: "Failed to generate insight." },
      { status: 500 }
    );
  }
}