

import CategoryPage from "../components/CategoryPage";
import { CATEGORY_META } from "../components/CategoryMeta";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = CATEGORY_META[slug];

  return {
    title: meta?.seoTitle || `${meta?.title} – Indiagraphs`,
    description: meta?.seoDescription || meta?.description,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CategoryPage slug={slug} />;
}