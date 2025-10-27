import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

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
  metadataBase: new URL("https://data.indiagraphs.com"),
  title: {
    default: "Indiagraphs - Interactive Data Stories",
    template: "%s | Indiagraphs",
  },
  description:
    "Explore India's economy, markets, and data stories through interactive graphs powered by trusted public sources.",
  icons: {
  icon: [
    { url: "/favicon.ico", type: "image/x-icon" },
    { url: "/favicon.png", type: "image/png" },
  ],
  apple: "/apple-touch-icon.png",
},
  openGraph: {
    title: "Indiagraphs - Interactive Graphs & Data Stories",
    description:
      "Discover data-backed visual insights on India’s economy, markets, and policies — interactive and updated regularly.",
    url: "https://data.indiagraphs.com",
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
    title: "Indiagraphs - Explore India's Data",
    description: "Interactive graphs from India's trusted data sources.",
    creator: "@indiagraphs",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://data.indiagraphs.com",
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
      <head>
        {/* ✅ Search Console Verification */}
        <meta
          name="google-site-verification"
          content="RkDeLLnLNGuRxZi2dRHYPGRh5CpWOYQuR2W0uQ1r9t0"
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* ✅ Google Tag Manager (use same container as main site) */}
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

        {/* ✅ GTM NoScript fallback (for older browsers) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P6T2PKQL"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
      </body>
    </html>
  );
}