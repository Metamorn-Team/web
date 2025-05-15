import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/app/provider";
import AlertProvider from "@/components/common/AlertProvider";

export const metadata: Metadata = {
  title: "🏝️섬으로 떠나 친구를 만나요~!",
  description: "일상을 떠나 평화로운 섬으로 - 리브아일랜드",
  icons: {
    icon: "/icons/favicon.png",
  },
  openGraph: {
    title: "🏝️섬으로 떠나 친구를 만나요~!",
    description: "일상을 떠나 평화로운 섬으로 - 리브아일랜드",
    url: "https://livisland.com",
    siteName: "리브아일랜드",
    images: [
      {
        url: "https://cdn.metamorn.com/vanner/ad-vanner.png",
        width: 1500,
        height: 1024,
        alt: "메타몬 OG 이미지",
      },
    ],
    type: "website",
  },
};

// const BMJUA = localFont({
//   src: "../fonts/BMJUA_otf.otf",
// });

const CookiRun = localFont({
  src: "../fonts/CookieRun_Regular.otf",
});

// const DungGeunMo = localFont({
//   src: "../fonts/NeoDunggeunmoPro-Regular.woff",
// });

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html>
      <body className={CookiRun.className}>
        <AlertProvider />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
