import type { Metadata } from "next";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata: Metadata = {
  title: "메타몬",
  description: "메타메타몬몬",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html>
      <body>
        <GoogleOAuthProvider clientId="643620098305-m4javmkthiki8jciimaloh1hj14g18ap.apps.googleusercontent.com">
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
