"use client";

import dynamic from "next/dynamic";

const Theme = dynamic(() => import("@/ui-kit/Theme").then((m) => m.Theme), {
  ssr: false,
});

export const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  return <Theme>{children}</Theme>;
};
