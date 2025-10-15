import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://indiagraphs.com"),
  title: {
    default: "Indiagraphs - Interactive Data Stories",
    template: "%s | Indiagraphs",
  },
  description:
    "Explore India's economy, markets, and data stories through interactive graphs powered by trusted public sources.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Indiagraphs - Interactive Graphs & Data Stories",
    description:
      "Discover data-backed visual insights on India’s economy, markets, and policies — interactive and updated regularly.",
    url: "https://indiagraphs.com",
    siteName: "Indiagraphs",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Indiagraphs - Data Visualization Platform",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indiagraphs - Data Visualization Platform",
    description: "Interactive graphs from India's trusted data sources.",
    creator: "@indiagraphs",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://indiagraphs.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: "#ffffff",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}