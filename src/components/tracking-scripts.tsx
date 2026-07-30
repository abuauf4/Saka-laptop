// ─── Jakarta Laptops — Tracking Scripts Injector (Server Component) ───
// Fetches settings dari DB, inject appropriate tracking scripts ke <head>.
// Supports: Google Tag Manager (priority), Google Analytics, Google Ads, Meta Pixel.

import { db } from "@/core/lib/db";

/** Google Ads Conversion ID — always loaded globally */
const GOOGLE_ADS_CONVERSION_ID = "AW-18221664763";

export async function TrackingScripts() {
  let settings: { googleAnalyticsId: string | null; metaPixelId: string | null; googleAdsId: string | null; gtmContainerId: string | null } | null = null;

  try {
    settings = await db.settings.findUnique({ where: { id: "default" } });
  } catch {
    // DB error, skip tracking
  }

  const gtm = settings?.gtmContainerId;
  const ga = settings?.googleAnalyticsId;
  const ads = settings?.googleAdsId;
  const pixel = settings?.metaPixelId;

  // Determine if Google Tag for the conversion ID is already handled
  const adsAlreadyLoaded = ads === GOOGLE_ADS_CONVERSION_ID;
  const gtmHandlesIt = !!gtm;
  const needsHardcodedAds = !gtmHandlesIt && !adsAlreadyLoaded;

  // If GTM is set, it handles everything — just inject GTM
  if (gtm) {
    return (
      <>
        {/* GTM Head */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtm}');`,
          }}
        />
        {/* GTM Body (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtm}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      </>
    );
  }

  // Otherwise, inject individual scripts
  return (
    <>
      {/* Google Analytics */}
      {ga && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga}');`,
            }}
          />
        </>
      )}

      {/* Google Ads (from DB settings) */}
      {ads && ads !== GOOGLE_ADS_CONVERSION_ID && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${ads}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ads}');`,
            }}
          />
        </>
      )}

      {/* Google Ads — hardcoded conversion tag (always present) */}
      {needsHardcodedAds && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_CONVERSION_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GOOGLE_ADS_CONVERSION_ID}');`,
            }}
          />
        </>
      )}

      {/* Meta Pixel */}
      {pixel && (
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixel}');
            fbq('track', 'PageView');`,
          }}
        />
      )}
    </>
  );
}
