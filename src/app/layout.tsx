import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/app/provider";
import AlertProvider from "@/components/common/AlertProvider";
import GoogleAnalytics from "@/app/GoogleAnalytics";
import SessionIdInitializer from "@/components/common/SessionIdInitializer";

export const metadata: Metadata = {
  title: "리브아일랜드",
  description: "우리들만의 귀여운 픽셀 섬 리브아일랜드!",
  keywords: [
    "리브아일랜드",
    "리브",
    "LivIsland",
    "메타버스",
    "소셜게임",
    "친구만나기",
    "섬여행",
    "온라인게임",
    "소셜플랫폼",
    "가상세계",
    "평화로운섬",
    "친구찾기",
    "게임",
    "소셜",
    "모험",
    "캐릭터",
    "아바타",
  ],
  applicationName: "리브아일랜드",
  authors: [{ name: "LivIsland Team" }],
  creator: "LivIsland Team",
  publisher: "LivIsland",
  robots:
    "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  metadataBase: new URL("https://livisland.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icons/favicon.png",
    shortcut: "/icons/favicon.png",
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "리브아일랜드 - 평화로운 섬에서 친구를 만나요 🏝️",
    description:
      "리브아일랜드에서 일상을 떠나 평화로운 섬으로! 새로운 친구들과 함께하는 소셜 메타버스 게임",
    url: "https://livisland.com",
    siteName: "리브아일랜드",
    images: [
      {
        url: "https://cdn.metamorn.com/vanner/ad-vanner.png",
        width: 1200,
        height: 630,
        alt: "리브아일랜드 - 평화로운 섬에서 친구를 만나요",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "리브아일랜드 - 평화로운 섬에서 친구를 만나요 🏝️",
    description:
      "리브아일랜드에서 일상을 떠나 평화로운 섬으로! 새로운 친구들과 함께하는 소셜 메타버스 게임",
    images: ["https://cdn.metamorn.com/vanner/ad-vanner.png"],
    site: "@livisland",
  },
  other: {
    "naver-site-verification": "your-naver-verification-code",
    "google-site-verification": "your-google-verification-code",
  },
};

const MapleStory = localFont({
  src: [
    {
      path: "../fonts/Maplestory_Bold.ttf",
      weight: "700",
      style: "bold",
    },
    {
      path: "../fonts/Maplestory_Light.ttf",
      weight: "500",
      style: "normal",
    },
  ],
});

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <script src="https://developers.kakao.com/sdk/js/kakao.js" async />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "리브아일랜드",
          "alternateName": ["리브", "리브아일랜드"],
          "url": "https://livisland.com",
          "description": "리브아일랜드에서 일상을 떠나 평화로운 섬으로! 새로운 친구들과 함께하는 귀여운 픽셀 메타버스",
          "inLanguage": "ko-KR",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://livisland.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
          "@context": "https://schema.org",
          "@type": "Game",
          "name": "리브아일랜드",
          "description": "평화로운 섬에서 친구들과 함께하는 귀여운 픽셀 메타버스",
          "genre": ["소셜게임", "메타버스", "어드벤처"],
          "applicationCategory": "Game",
          "operatingSystem": "Web Browser",
          "url": "https://livisland.com",
          "publisher": {
            "@type": "Organization",
            "name": "LivIsland Team"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "KRW"
          }
        }`,
          }}
        />
      </head>
      <body className={MapleStory.className}>
        <SessionIdInitializer />
        <AlertProvider />
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        ) : null}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
