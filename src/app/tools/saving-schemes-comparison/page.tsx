// app/tools/savings-comparison-calculator/page.tsx

import type { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "Savings Comparison Calculator (India) - Compare PPF, SSY, FD, NSC, SCSS",
  description:
    "Compare returns from PPF, SSY, FD, NSC, SCSS and other Indian savings schemes. Get maturity amounts, CAGR, and tax-adjusted results instantly.",
  alternates: {
    canonical: "https://www.indiagraphs.com/tools/savings-comparison-calculator",
  },
  openGraph: {
    title: "Savings Comparison Calculator (India) - Compare PPF, SSY, FD, NSC, SCSS",
    description:
      "Compare savings schemes like PPF, SSY, FD, SCSS, NSC & more. Calculate maturity values and real returns instantly.",
    type: "article",
    url: "https://www.indiagraphs.com/tools/savings-comparison-calculator",
    images: [
      "https://www.indiagraphs.com/og/savings-comparison.png",
    ],
  },
};

// Server component → Only loads ClientPage
export default function Page() {
  return <ClientPage />;
}