import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { graph } = await req.json();
    const { title, category, datasets } = graph;
    const points = datasets?.[0]?.data_points || [];

    // compact data summary for model context
    const summary = points
      .slice(-40)
      .map((p: any) => `${p.period_label}: ${p.value}`)
      .join(", ");

const prompt = `
You are Indiagraphs’ data insight analyst.
You write short, factual explanations of Indian public datasets.

TASK:
Explain what this dataset shows — in 2–3 concise, neutral sentences (<50 words).
Your answer must be purely data-driven, without opinions or reasons.

DATA:
Title: ${title}
Category: ${category}
Recent values: ${summary}

RULES:
- Focus only on visible data, not predictions or external causes.
- Mention direction of change (rising / falling / stable) and first vs latest value.
- Never mention UI actions (click, download, chart, explore).
- If the dataset is short (<5 points), say “shows limited variation over time.”
- Keep tone factual, professional, and simple enough for general readers.

Example output:
"Between 2015 and 2025, Sukanya Samriddhi Yojana rates declined from 9.2% to 8.2%, showing a gradual downward adjustment with a mild recovery recently."
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_tokens: 150,
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