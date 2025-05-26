import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/app/provider";
import AlertProvider from "@/components/common/AlertProvider";
import GoogleAnalytics from "@/app/GoogleAnalytics";

export const metadata: Metadata = {
  title: "🏝️섬으로 떠나 친구를 만나요~!",
  description: "일상을 떠나 평화로운 섬으로 - 리브아일랜드",
  keywords: ["메타버스", "리브아일랜드", "친구", "섬", "게임", "소셜", "모험"],
  applicationName: "리브아일랜드",
  authors: [{ name: "LivIsland Team" }],
  creator: "LivIsland Team",
  publisher: "LivIsland",
  robots: "index, follow",
  metadataBase: new URL("https://livisland.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icons/favicon.png",
    shortcut: "/icons/favicon.png",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "🏝️섬으로 떠나 친구를 만나요~!",
    description: "일상을 떠나 평화로운 섬으로 - 리브아일랜드",
    url: "https://livisland.com",
    siteName: "리브아일랜드",
    images: [
      {
        url: "https://cdn.metamorn.com/vanner/ad-vanner.png",
        width: 1200,
        height: 630,
        alt: "리브아일랜드 OG 이미지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "🏝️섬으로 떠나 친구를 만나요~!",
    description: "일상을 떠나 평화로운 섬으로 - 리브아일랜드",
    images: ["https://cdn.metamorn.com/vanner/ad-vanner.png"],
    site: "@livisland",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "리브아일랜드",
          "url": "https://livisland.com",
          "description": "일상을 떠나 평화로운 섬으로 - 리브아일랜드",
          "inLanguage": "ko-KR"
        }`,
          }}
        />
      </head>
      <body className={MapleStory.className}>
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
