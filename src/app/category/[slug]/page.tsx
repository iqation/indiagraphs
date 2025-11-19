

import CategoryPage from "../components/CategoryPage";
import { CATEGORY_META } from "../components/CategoryMeta";

export async function generateMetadata({ params }: any) {
  const meta = CATEGORY_META[params.slug];

  return {
    title: meta?.seoTitle || `${meta?.title} – Indiagraphs`,
    description: meta?.seoDescription || meta?.description,
  };
}

export default function Page({ params }: any) {
  return <CategoryPage slug={params.slug} />;
}