import IGHeader from "../components/IGHeader";
import IGFooter from "../components/IGFooter";
import Link from "next/link";
import he from "he";

export const revalidate = 300;   // ✅ ISR: regenerate every 5 minutes
export const dynamic = "force-static"; // ✅ static but safe
export const fetchCache = "force-cache";

const CATEGORY_ID = 191;
const WP_API = `https://cms.indiagraphs.com/wp-json/wp/v2/posts?categories=${CATEGORY_ID}&per_page=24&_embed`;

// Clean excerpt helper
function cleanExcerpt(html: string = "") {
  if (!html) return "";
  let text = html.replace(/<[^>]+>/g, " ");
  text = he.decode(text);
  return text.replace(/\s+/g, " ").trim();
}

export default async function DataStoriesPage() {
  let stories: any[] = [];

  try {
    const res = await fetch(WP_API, {
      cache: "force-cache",
      next: { revalidate: 300 }, // 💡 fallback safety
    });

    if (!res.ok) throw new Error("WP API not OK");

    stories = await res.json();
  } catch (err) {
    console.error("⚠️ Failed to fetch stories at build/runtime:", err);
    stories = []; // ✅ graceful fallback, no crash
  }

  return (
    <>
      <IGHeader />

      <main className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">
          Data Stories
        </h1>

        {stories.length === 0 ? (
          <p className="text-slate-500">Stories are temporarily unavailable.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story: any) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </main>

      <IGFooter />
    </>
  );
}

function StoryCard({ story }: { story: any }) {
  const featured =
    story._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;

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