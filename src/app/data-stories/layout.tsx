export const metadata = {
  title: "India Data Stories -  Insights from Official Govt Data",
  description:
    "Explore data-driven stories, visual insights, and analytical narratives on Indiagraphs.",
  alternates: {
    canonical: "https://indiagraphs.com/data-stories",
  },
  openGraph: {
    title: "India Data Stories -  Insights from Official Govt Data",
    description:
      "Explore data-driven stories, visual insights, and analytical narratives on Indiagraphs.",
    url: "https://indiagraphs.com/data-stories",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "India Data Stories -  Insights from Official Govt Data",
    description:
      "Explore data-driven stories, visual insights, and analytical narratives on Indiagraphs.",
  },
};

export default function DataStoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}