import IGHeader from "../components/IGHeader";
import IGFooter from "../components/IGFooter";
import * as he from "he";

const WP_API = "https://cms.indiagraphs.com/wp-json/wp/v2";

async function fetchWPPageBySlug(slug: string) {
  try {
    const res = await fetch(`${WP_API}/pages?slug=${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.[0] || null;
  } catch (e) {
    console.error("fetchWPPageBySlug error:", e);
    return null;
  }
}

export default async function AboutPage() {
  const page = await fetchWPPageBySlug("about");
  if (!page) return <div className="p-20 text-center">Not found</div>;

  const title = he.decode(page.title?.rendered || "");
  const content = he.decode(page.content?.rendered || "");

  return (
    <>
      <IGHeader />

      <main className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">{title}</h1>

        <article
          className="prose prose-indigo max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </main>

      <IGFooter />
    </>
  );
}
