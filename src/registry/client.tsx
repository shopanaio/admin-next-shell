"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SidebarItem } from "./registry";

const SidebarItemsContext = createContext<SidebarItem[]>([]);

interface SidebarItemsProviderProps {
  children: ReactNode;
  items: SidebarItem[];
}

export function SidebarItemsProvider({ children, items }: SidebarItemsProviderProps) {
  return (
    <SidebarItemsContext.Provider value={items}>
      {children}
    </SidebarItemsContext.Provider>
  );
}

export function useSidebarItems(): SidebarItem[] {
  return useContext(SidebarItemsContext);
}
