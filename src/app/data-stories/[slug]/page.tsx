import Link from "next/link";
import IGHeader from "../../components/IGHeader";
import IGFooter from "../../components/IGFooter";
import * as he from "he";
import CommentSection from "./CommentSection";
import { Metadata } from "next";

const WP_API = "https://cms.indiagraphs.com/wp-json/wp/v2";

type FAQItem = {
  question: string;
  answer: string;
};

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

  // wrap all tables in scroll container for responsive behavior
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

function extractFaqFromRankMath(head: string): FAQItem[] {
  const schemaMatch = head.match(
    /<script type="application\/ld\+json" class="rank-math-schema">([\s\S]*?)<\/script>/
  );

  if (!schemaMatch) return [];

  const schemaJson = schemaMatch[1];

  try {
    const schema = JSON.parse(schemaJson);

    const graph = schema["@graph"] || [];

    const faqPage = graph.find((item: any) =>
      item["@type"]?.includes("FAQPage")
    );

    if (!faqPage || !faqPage.mainEntity) return [];

    return faqPage.mainEntity.map((faq: any) => ({
      question: faq.name as string,
      answer: faq.acceptedAnswer?.text || "",
    }));
  } catch (e) {
    console.error("FAQ PARSE ERROR:", e);
    return [];
  }
}

// ---------------------------
// Dynamic SEO Metadata (Next.js 15 async params)
// ---------------------------
export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { params } = props;
  const { slug } = await params;

  const canonicalUrl = `https://indiagraphs.com/data-stories/${slug}`;

  // RankMath expects the WordPress URL (with /data-stories/ and trailing slash)
  const wpUrl = `https://cms.indiagraphs.com/data-stories/${slug}/`;
  const seo = await fetchRankMathSEO(wpUrl);

  let title = decodeHtmlEntities(seo.title || "");
  let description = decodeHtmlEntities(seo.description || "");

  if (!title || !description) {
    const story = await fetchStory(slug);
    if (story) {
      if (!title) title = decodeHtmlEntities(story.title?.rendered || "");
      if (!description) {
        const excerpt = (story.excerpt?.rendered || "").replace(/<[^>]+>/g, "");
        description = decodeHtmlEntities(excerpt);
      }
    }
  }

  return {
    title: title || "Indiagraphs Data Story",
    description: description || "Explore this data story on Indiagraphs.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: seo.ogImage ? [seo.ogImage] : [],
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
// Page Component (Next.js 15 async params)
// ---------------------------
export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const story = await fetchStory(slug);
  if (!story) return <div className="p-20 text-center">Not found</div>;

  // Use same WP URL for FAQ schema / SEO head
  const wpUrl = `https://cms.indiagraphs.com/data-stories/${slug}/`;
  const seo = await fetchRankMathSEO(wpUrl);
  const faqs = extractFaqFromRankMath(seo.head);

  const related = await fetchRelatedStories(story.id);
  const title = he.decode(story.title.rendered);
  const content = normalize(story.content.rendered);
  const cover = story._embedded?.["wp:featuredmedia"]?.[0]?.source_url as
    | string
    | undefined;

  const words = story.content.rendered
    .replace(/<[^>]+>/g, "")
    .split(/\s+/).length;
  const readTime = Math.max(2, Math.ceil(words / 200));

  const formattedDate = new Date(story.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <IGHeader />

      {/* DESKTOP COVER IMAGE (above content) */}
      {cover && (
        <div className="hidden sm:block w-full bg-white pt-20">
          <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
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
          max-w-full
          sm:max-w-3xl 
          mx-auto 
          px-3
          sm:px-6
          mt-[-50px] 
          z-[10]
          bg-white
        "
      >
        {/* MOBILE TITLE + META (top) */}
        <div className="sm:hidden mt-20 mb-4 px-1">
          <Link
            href="/data-stories"
            className="text-xs text-indigo-600 hover:underline"
          >
            ← Back to Data Stories
          </Link>

          <h1 className="text-2xl font-bold editorial-title text-slate-900 mt-3 leading-snug">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-[13px] text-slate-500 mt-2">
            <span>{formattedDate}</span>
            <span>• {readTime} min read</span>
            <span>•</span>
            <span className="text-indigo-600 font-semibold">
              Indiagraphs Insights
            </span>
          </div>

          {cover && (
            <div className="mt-4">
              <img
                src={cover}
                alt={title}
                className="w-full rounded-xl shadow-md object-cover"
              />
            </div>
          )}
        </div>

        {/* Main article container: full-width on mobile, card on desktop */}
        <div
          className="
            article-card
            bg-white border border-slate-200 shadow-sm
            px-4 sm:px-8
            py-6 sm:py-10
            sm:rounded-xl
          "
        >
          {/* Back link (desktop) */}
          <Link
            href="/data-stories"
            className="hidden sm:inline-block text-sm text-indigo-600 hover:underline"
          >
            ← Back to Data Stories
          </Link>

          {/* Title + meta (desktop) */}
          <h1 className="hidden sm:block text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 editorial-title">
            {title}
          </h1>

          <div className="hidden sm:flex items-center gap-3 text-sm text-slate-500 mt-4">
            <span>{formattedDate}</span>
            <span>• {readTime} min read</span>
            <span>•</span>
            <span className="text-indigo-600 font-semibold">
              Indiagraphs Insights
            </span>
          </div>

          {/* ARTICLE BODY – uses editorial.css + table-scroll for tables */}
          <article
            className="
              editorial
              data-story-body
              max-w-none 
              mt-6
            "
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* FAQ section (from RankMath schema) – optional; still commented if you don’t want UI */}
          {/*
          {faqs.length > 0 && (
            <section className="ig-faq mt-10">
              <h2 className="editorial-subtitle text-xl sm:text-2xl font-semibold mb-4 text-slate-900">
                Frequently Asked Questions
              </h2>
              <div>
                {faqs.map((faq: FAQItem, idx: number) => (
                  <div key={idx} className="faq-item active">
                    <button type="button" className="faq-question">
                      <span>{faq.question}</span>
                      <span className="faq-icon">+</span>
                    </button>
                    <div
                      className="faq-answer"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
          */}
        </div>

        {/* Related stories */}
        {related.length > 0 && (
          <div className="mt-16 mb-20">
            <h2 className="text-2xl font-bold mb-6 editorial-subtitle">
              Related Data Stories
            </h2>

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
                      alt={he.decode(item.title.rendered)}
                    />
                  )}
                  <div className="p-4">
                    <h3
                      className="font-semibold text-slate-900 hover:underline editorial-subtitle"
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