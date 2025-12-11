// ✅ app/account/layout.tsx
import { getDictionary } from "@/app/account/locales/dictionary";
import DictionaryProvider from "@/app/account/locales/DictionaryProvider";
import ProgressBar from "@/app/account/ProgressBar/ProgressBar";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dictionary = await getDictionary();

  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
  const vercelAnalytics = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === "true";
  const googleAdsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID ?? "";

  return (
    <>
      <ProgressBar />
      <DictionaryProvider dictionary={dictionary}>
        {children} {/* ✅ MUST RENDER */}
      </DictionaryProvider>

      {vercelAnalytics && <Analytics />}

      {gaMeasurementId && <GoogleAnalytics gaId={gaMeasurementId} />}

      {googleAdsenseId && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsenseId}`}
          crossOrigin="anonymous"
        />
      )}
    </>
  );
}
