import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { graph, activeDatasetId } = await req.json();

    const {
      title,
      description = "",
      category,
      source = "",
      datasets = [],
      country = "India",
    } = graph;

    // ✅ Select correct dataset based on activeDatasetId
    const dataset =
      datasets.find((d: any) => d.id === activeDatasetId) || datasets[0];

    const points = dataset?.data_points || [];
    const unit = dataset?.unit || "";
    const metricBehavior =
      dataset?.metric_behavior || dataset?.metric_type || "value";

    if (!points.length) {
      return NextResponse.json(
        { error: "No datapoints available for this graph." },
        { status: 400 }
      );
    }

    // -------------------------------
    // SORT DATA CHRONOLOGICALLY
    // -------------------------------
    function extractYear(label: string): number {
      if (!label) return 0;

      const years = label.match(/\d{4}/g)?.map(Number);
      if (years?.length) return Math.max(...years);

      const fyMatch = label.match(/FY\s?(\d{2})/i);
      if (fyMatch) {
        const yr = parseInt(fyMatch[1], 10);
        return yr < 50 ? 2000 + yr : 1900 + yr;
      }

      return 0;
    }

    const sortedPoints = [...points].sort(
      (a, b) => extractYear(a.period_label) - extractYear(b.period_label)
    );

    const compactSeries = sortedPoints.map((p: any) => ({
      period: p.period_label,
      value: p.value,
    }));

    const first = compactSeries[0];
    const latest = compactSeries[compactSeries.length - 1];

    const seriesPreview = compactSeries
      .slice(-40)
      .map((p) => `${p.period}: ${p.value}`)
      .join(", ");

    // -------------------------------
    // PROMPT
    // -------------------------------
    const prompt = `
You are Indiagraphs’ data insight analyst.
You explain Indian public datasets in clear, factual language.

ACTIVE DATASET NAME: ${dataset.name}
UNIT: ${unit}

TIME SERIES (earliest → latest):
${seriesPreview}

First point: ${first.period} = ${first.value} ${unit}
Latest point: ${latest.period} = ${latest.value} ${unit}

TASK:
Write a short 2–3 sentence explanation (<60 words) of what this dataset shows.

RULES:
- Mention whether values rise, fall, stay flat, or are volatile.
- Mention first and last values with unit.
- Stick strictly to the data.
- No forecasting, no guessing causes, no policy or event assumptions.
- No investment advice.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 180,
    });

    const answer = completion.choices[0]?.message?.content?.trim() || "";
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("ask-graph error:", err);
    return NextResponse.json(
      { error: "Failed to generate insight." },
      { status: 500 }
    );
  }
}