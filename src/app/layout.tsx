import type { Metadata } from "next";
import { Theme } from "@/ui-kit/Theme";

export const metadata: Metadata = {
  title: "Admin Shell",
  description: "Admin panel powered by Next.js and Ant Design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
