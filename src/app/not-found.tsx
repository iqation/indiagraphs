// app/not-found.tsx
import Link from "next/link";
import IGHeader from "./components/IGHeader";
import IGFooter from "./components/IGFooter";
import he from "he";

const WP_API =
  "https://cms.indiagraphs.com/wp-json/wp/v2/posts?categories=191&per_page=4&_embed";

// Fetch 4 latest data stories
async function fetchLatestStories() {
  try {
    const res = await fetch(WP_API, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}

export default async function NotFoundPage() {
  const stories = await fetchLatestStories();

  return (
    <>
      <IGHeader />

      <main className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
          Oops! Page Not Found
        </h1>

        <p className="text-slate-600 text-lg mb-8">
          The page you’re looking for doesn’t exist.  
          Here are some fresh stories you may find interesting.
        </p>

        <Link
          href="/"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition"
        >
          Go to Home
        </Link>

        {/* Latest Data Stories */}
        {stories.length > 0 && (
          <div className="mt-16 text-left">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">
              Latest Data Stories
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {stories.map((story: any) => {
                const featured =
                  story._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

                return (
                  <Link
                    key={story.id}
                    href={`/data-stories/${story.slug}`}
                    className="bg-white border rounded-xl shadow hover:shadow-md transition block overflow-hidden"
                  >
                    {featured && (
                      <img
                        src={featured}
                        className="w-full h-40 object-cover"
                        alt={he.decode(story.title.rendered || "")}
                      />
                    )}

                    <div className="p-4">
                      <h3
                        className="font-semibold text-slate-900 hover:underline text-lg"
                        dangerouslySetInnerHTML={{
                          __html: he.decode(story.title.rendered || ""),
                        }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <IGFooter />
    </>
  );
}