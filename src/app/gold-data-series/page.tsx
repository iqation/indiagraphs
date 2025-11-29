import IGHeader from "../components/IGHeader";
import IGFooter from "../components/IGFooter";
import Link from "next/link";
import he from "he";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

const GOLD_TAG_ID = 165;
const WP_API = `https://cms.indiagraphs.com/wp-json/wp/v2/posts?tags=${GOLD_TAG_ID}&per_page=30&_embed`;

export const metadata: Metadata = {
  title: "Gold Data Series: India's Gold Imports, Prices & Reserves",
  description:
    "Explore 25 years of gold data in India — imports, prices, reserves, and trends that reveal how gold shapes our economy, investments, and national policy.",
  openGraph: {
    title: "Gold Data Series: India's Gold Imports, Prices & Reserves",
    description:
      "Explore 25 years of gold data in India — imports, prices, reserves, and long-term financial trends.",
    images: ["https://indiagraphs.com/images/gold-data-series.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gold Data Series: India's Gold Imports, Prices & Reserves",
    images: ["https://indiagraphs.com/images/gold-data-series.png"],
  },
};

// Clean excerpt
function cleanExcerpt(html: string = "") {
  if (!html) return "";
  let text = html.replace(/<[^>]+>/g, " ");
  text = he.decode(text);
  return text.replace(/\s+/g, " ").trim();
}

export default async function GoldSeriesPage() {
  const res = await fetch(WP_API, { cache: "no-store" });
  const stories = await res.json();

  return (
    <>
      <IGHeader />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
          Gold Data Series
        </h1>

        <p className="text-slate-600 text-lg max-w-2xl mb-10">
          A complete collection of India’s gold-related data stories updated
          regularly with insights, price trends, reserves, and long-term
          economic patterns.
        </p>

        {/* POSTS GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.length === 0 && (
            <p>No gold data stories found.</p>
          )}

          {stories.map((story: any) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </main>

      <IGFooter />
    </>
  );
}

function StoryCard({ story }: { story: any }) {
  const featured = story._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return (
    <Link
      href={`/data-stories/${story.slug}`}
      className="bg-white rounded-xl border shadow hover:shadow-lg transition block overflow-hidden"
    >
      {featured && (
        <img
          src={featured}
          className="w-full h-44 object-cover"
          alt={cleanExcerpt(story.title.rendered)}
        />
      )}

      <div className="p-4">
        <h2
          className="text-lg font-bold text-slate-900 leading-snug"
          dangerouslySetInnerHTML={{ __html: story.title.rendered }}
        />

        <p className="text-slate-600 text-sm mt-2 line-clamp-3">
          {cleanExcerpt(story.excerpt?.rendered)}
        </p>
      </div>
    </Link>
  );
}