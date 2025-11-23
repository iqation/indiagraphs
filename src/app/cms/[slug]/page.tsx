import Link from "next/link";
import IGHeader from "../../components/IGHeader";
import IGFooter from "../../components/IGFooter";
import * as he from "he";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// --------------------------------------
// Allowed WP page slugs
// --------------------------------------
const ALLOWED_WP_PAGES = [
  "about",
  "privacy-policy",
  "terms-conditions",
  "disclaimer",
];

// --------------------------------------
// Fetch WordPress page by slug
// --------------------------------------
async function fetchWPPageBySlug(slug: string) {
  try {
    const res = await fetch(
      `https://cms.indiagraphs.com/wp-json/wp/v2/pages?slug=${slug}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;

    const data = await res.json();
    return data?.[0] || null;
  } catch {
    return null;
  }
}

// --------------------------------------
// PAGE COMPONENT
// --------------------------------------
export default async function WPPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  // Validate slug
  if (!ALLOWED_WP_PAGES.includes(slug)) {
    return notFound();
  }

  // Fetch WP page
  const page = await fetchWPPageBySlug(slug);
  if (!page) return notFound();

  const title = he.decode(page.title.rendered);
  const content = he.decode(page.content.rendered);

  return (
    <>
      <IGHeader />

      <main className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">
          {title}
        </h1>

        <article
          className="
            prose prose-indigo max-w-none
            prose-h2:text-2xl prose-h2:font-bold
            prose-h3:text-xl prose-h3:font-semibold
            prose-p:text-[1.1rem] prose-p:leading-7
            prose-li:text-[1.1rem] prose-li:leading-7
          "
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </main>

      <IGFooter />
    </>
  );
}