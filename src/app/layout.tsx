import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/app/provider";
import AlertProvider from "@/components/common/AlertProvider";

export const metadata: Metadata = {
  title: "🏝️섬으로 떠나 친구를 만나요~!",
  description: "리브아일랜드",
  icons: {
    icon: "/icons/favicon.png",
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
