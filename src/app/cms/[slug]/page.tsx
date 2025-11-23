import Link from "next/link";
import IGHeader from "../../components/IGHeader";
import IGFooter from "../../components/IGFooter";
import * as he from "he";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Allowed WP slugs
const ALLOWED_WP_PAGES = [
  "about",
  "privacy-policy",
  "terms-conditions",
  "disclaimer",
];

// Fetch WP page
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

// ⭐ FIXED — NEXT.JS 15 COMPATIBLE
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  if (!ALLOWED_WP_PAGES.includes(slug)) return {};

  const page = await fetchWPPageBySlug(slug);
  if (!page) return {};

  return {
    title: he.decode(page.title.rendered),
    description:
      he.decode(
        page.excerpt?.rendered?.replace(/<[^>]*>?/gm, "") || ""
      ) || "",
  };
}

// ⭐ FIXED — PAGE COMPONENT
export default async function WPPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  if (!ALLOWED_WP_PAGES.includes(slug)) {
    return notFound();
  }

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
          className="prose prose-indigo max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </main>

      <IGFooter />
    </>
  );
}