import type { Metadata } from "next";
import { ClientOnly } from "./ClientOnly";

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
        <ClientOnly>{children}</ClientOnly>
      </body>
    </html>
  );
}
