import { supabase } from "../../lib/supabaseClient";
import GraphPage from "./GraphPage";
// ✅ Required for Next.js 15+


export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params; // ✅ await required

  // 🧭 Fetch graph details for SEO metadata
  const { data: graph } = await supabase
    .from("graphs")
    .select("title, description, source, category")
    .eq("slug", slug)
    .single();

  if (!graph) {
    return {
      title: "Graph Not Found ",
      description: "The requested graph could not be found.",
      robots: { index: false },
    };
  }

  const title = `${graph.title} `;
  const description =
    graph.description ||
    `Explore ${graph.title} — interactive data visualization powered by official Indian data sources.`;

  const ogImage = `https://indiagraphs.com/og-images/${slug}.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://indiagraphs.com/graphs/${slug}`,
      siteName: "Indiagraphs",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: graph.title,
        },
      ],
      locale: "en_IN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://indiagraphs.com/graphs/${slug}`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // ✅ added await
  return <GraphPage />;
}