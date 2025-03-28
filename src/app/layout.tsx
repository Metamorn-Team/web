import type { Metadata } from "next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
  title: "메타몬",
  description: "메타메타몬몬",
  icons: {
    icon: "/icons/favicon.png",
  },
};

const BMJUA = localFont({
  src: "../fonts/BMJUA_otf.otf",
});

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html>
      <body className={BMJUA.className}>
        <GoogleOAuthProvider clientId="643620098305-m4javmkthiki8jciimaloh1hj14g18ap.apps.googleusercontent.com">
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
