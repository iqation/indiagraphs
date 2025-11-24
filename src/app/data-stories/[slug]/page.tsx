import Link from "next/link";
import IGHeader from "../../components/IGHeader";
import IGFooter from "../../components/IGFooter";
import * as he from "he";
import CommentSection from "./CommentSection";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

const WP_API = "https://cms.indiagraphs.com/wp-json/wp/v2";

// ---------------------------
// Fetch story
// ---------------------------
async function fetchStory(slug: string) {
  try {
    const res = await fetch(`${WP_API}/posts?slug=${slug}&_embed`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error("WP error");
    const data = await res.json();
    return data?.[0] || null;
  } catch (e) {
    console.error("FETCH ERROR", e);
    return null;
  }
}

// ---------------------------
// Fetch related stories
// ---------------------------
async function fetchRelatedStories(id: number) {
  try {
    const res = await fetch(
      `${WP_API}/posts?categories=191&exclude=${id}&per_page=6&_embed`,
      { next: { revalidate: 60 } }
    );
    return await res.json();
  } catch {
    return [];
  }
}

// ---------------------------
// Clean HTML
// ---------------------------
function normalize(html: string) {
  let out = he.decode(html || "");
  out = out.replace(/<p><strong>(.*?)<\/strong><\/p>/gi, "<h2>$1</h2>");
  out = out.replace(/<figure[^>]*class="wp-block-table"[^>]*>/gi, "");
  out = out.replace(/<\/figure>/gi, "");

  out = out.replace(
    /<table([\s\S]*?)<\/table>/gi,
    `<div class="table-scroll"><table$1</table></div>`
  );
  return out;
}

// ---------------------------
// Rank Math SEO Fetch Helper
// ---------------------------
async function fetchRankMathSEO(url: string) {
  const apiUrl = `https://cms.indiagraphs.com/wp-json/rankmath/v1/getHead?url=${encodeURIComponent(
    url
  )}`;

  try {
    const res = await fetch(apiUrl, { next: { revalidate: 60 } });
    if (!res.ok)
      return { title: "", description: "", canonical: "", ogImage: "", head: "" };

    const data = await res.json();
    const head: string = data?.head || "";

    const findMeta = (patterns: RegExp[]) => {
      for (const p of patterns) {
        const m = head.match(p)?.[1];
        if (m && m.trim()) return m;
      }
      return "";
    };

    const title = findMeta([
      /<meta property="og:title" content="([\s\S]*?)"/i,
      /<meta name="twitter:title" content="([\s\S]*?)"/i,
      /<meta name="title" content="([\s\S]*?)"/i,
      /<title>([\s\S]*?)<\/title>/i,
    ]);

    const description = findMeta([
      /<meta property="og:description" content="([\s\S]*?)"/i,
      /<meta name="twitter:description" content="([\s\S]*?)"/i,
      /<meta name="description" content="([\s\S]*?)"/i,
    ]);

    const canonical =
      head.match(/<link rel="canonical" href="([^"]*?)"/i)?.[1] || "";
    const ogImage =
      head.match(/<meta property="og:image" content="([^"]*?)"/i)?.[1] || "";

    return { title, description, canonical, ogImage, head };
  } catch (e) {
    console.error("fetchRankMathSEO error:", e);
    return { title: "", description: "", canonical: "", ogImage: "", head: "" };
  }
}

// Robust HTML decode
function decodeHtmlEntities(input: string) {
  if (!input) return "";
  let out = he.decode(input);
  for (let i = 0; i < 2; i++) {
    const next = he.decode(out);
    if (next === out) break;
    out = next;
  }
  return out.trim();
}

function extractFaqFromRankMath(head: string) {
  const schemaMatch = head.match(
    /<script type="application\/ld\+json" class="rank-math-schema">([\s\S]*?)<\/script>/
  );

  if (!schemaMatch) return [];

  let schemaJson = schemaMatch[1];

  try {
    const schema = JSON.parse(schemaJson);

    const graph = schema["@graph"] || [];

    const faqPage = graph.find((item: any) =>
      item["@type"]?.includes("FAQPage")
    );

    if (!faqPage || !faqPage.mainEntity) return [];

    return faqPage.mainEntity.map((faq: any) => ({
      question: faq.name,
      answer: faq.acceptedAnswer?.text || "",
    }));
  } catch (e) {
    console.error("FAQ PARSE ERROR:", e);
    return [];
  }
}

// ---------------------------
// Dynamic SEO Metadata
// ---------------------------
export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const { slug } = (await params) as { slug: string };
  const fullUrl = `https://cms.indiagraphs.com/data-stories/${slug}`;

  const seo = await fetchRankMathSEO(fullUrl);

  let title = decodeHtmlEntities(seo.title || "");
  let description = decodeHtmlEntities(seo.description || "");

  if (!title || !description) {
    try {
      const story = await fetchStory(slug);
      if (story) {
        if (!title) title = decodeHtmlEntities(story.title?.rendered || "");
        if (!description) {
          const excerpt = (story.excerpt?.rendered || "").replace(/<[^>]+>/g, "");
          description = decodeHtmlEntities(excerpt);
        }
      }
    } catch {}
  }

  return {
    title: title || "",
    description: description || "",
    alternates: {
      canonical: seo.canonical || fullUrl,
    },
    openGraph: {
      title,
      description,
      images: seo.ogImage ? [seo.ogImage] : [],
      url: fullUrl,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
  };
}

// ---------------------------
// Page Component
// ---------------------------
export default async function StoryPage({ params }: { params: any }) {
  const { slug } = (await params) as { slug: string };

  const story = await fetchStory(slug);

  const fullUrl = `https://cms.indiagraphs.com/data-stories/${slug}`;
  const seo = await fetchRankMathSEO(fullUrl);

  const faqs = extractFaqFromRankMath(seo.head);
  if (!story) return <div className="p-20 text-center">Not found</div>;

  const related = await fetchRelatedStories(story.id);
  const title = he.decode(story.title.rendered);
  const content = normalize(story.content.rendered);
  const cover = story._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  const words = story.content.rendered
    .replace(/<[^>]+>/g, "")
    .split(/\s+/).length;
  const readTime = Math.max(2, Math.ceil(words / 200));

  return (
    <>
      <IGHeader />

      {cover && (
        <div className="w-full bg-white pt-20">
          <div className="max-w-5xl mx-auto">
            <img
              src={cover}
              alt={title}
              className="w-full rounded-xl shadow-md max-h-[420px] object-cover"
            />
          </div>
        </div>
      )}

      <main
        className="
          relative 
          max-w-3xl 
          mx-auto 
          px-6 
          mt-[-50px] 
          z-[10]
        "
      >
        <div className="bg-white border border-slate-200 shadow-sm px-8 py-10 rounded-xl">
          <Link
            href="/data-stories"
            className="text-sm text-indigo-600 hover:underline"
          >
            ← Back to Data Stories
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4">
            {title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-slate-500 mt-4">
            <span>
              {new Date(story.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>

            <span>• {readTime} min read</span>

            <span>•</span>

            <span className="text-indigo-600 font-semibold">
              Indiagraphs Insights
            </span>
          </div>

          <article
            className="
              data-story-body  
              prose 
              prose-indigo 
              max-w-none 
              mt-8
              prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-10 prose-h3:mb-3
              prose-p:text-[1.07rem] prose-p:leading-8
              prose-li:text-[1.05rem] prose-li:leading-7
              prose-table:border prose-table:border-slate-300
              prose-th:bg-slate-100 
              prose-th:px-3 prose-th:py-2
              prose-td:px-3 prose-td:py-2
            "
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {related.length > 0 && (
          <div className="mt-16 mb-20">
            <h2 className="text-2xl font-bold mb-6">Related Data Stories</h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {related.map((item: any) => (
                <Link
                  key={item.id}
                  href={`/data-stories/${item.slug}`}
                  className="block bg-white border rounded-xl shadow-sm hover:shadow-md transition"
                >
                  {item._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                    <img
                      src={item._embedded["wp:featuredmedia"][0].source_url}
                      className="w-full h-40 object-cover rounded-t-xl"
                    />
                  )}
                  <div className="p-4">
                    <h3
                      className="font-semibold text-slate-900 hover:underline"
                      dangerouslySetInnerHTML={{
                        __html: he.decode(item.title.rendered),
                      }}
                    />
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                      {he.decode(
                        item.excerpt.rendered.replace(/<[^>]+>/g, "")
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <CommentSection postId={story.id} />
      </main>

      <IGFooter />
    </>
  );
}