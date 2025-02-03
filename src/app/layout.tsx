import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
