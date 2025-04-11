import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/app/provider";

export const metadata: Metadata = {
  title: "메타몬",
  description: "메타메타몬몬",
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

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html>
      <body className={CookiRun.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
