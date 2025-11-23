// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./editorial.css";
import Script from "next/script";
import type { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Separate viewport export (Next.js requirement)
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://indiagraphs.com"),
  title: {
    default: "India's Data Stories, Interactive Graphs & Insights",
    template: "%s | Indiagraphs",
  },
  description:
    "Explore India's economy, markets, society, and government data through interactive charts, visual stories, and insights powered by trusted official sources.",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "India's Data Stories, Interactive Graphs & Insights | Indiagraphs",
    description:
      "Explore India's economy, markets, society, and government data through interactive charts, visual stories, and insights powered by trusted official sources.",
    url: "https://indiagraphs.com",
    siteName: "Indiagraphs",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Indiagraphs - Explore India's Data",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "India's Data Stories, Interactive Graphs & Insights | Indiagraphs",
    description: "Explore India's economy, markets, society, and government data through interactive charts, visual stories, and insights powered by trusted official sources.",
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
};


export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Search Console */}
        <meta
          name="google-site-verification"
          content="RkDeLLnLNGuRxZi2dRHYPGRh5CpWOYQuR2W0uQ1r9t0"
        />

        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-P6T2PKQL');
          `}
        </Script>
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* GTM noscript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P6T2PKQL"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {children}
      </body>
    </html>
  );
}
