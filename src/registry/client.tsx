"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AntMenuItem } from "./registry";

const MenuItemsContext = createContext<AntMenuItem[]>([]);

interface MenuItemsProviderProps {
  children: ReactNode;
  items: AntMenuItem[];
}

export function MenuItemsProvider({ children, items }: MenuItemsProviderProps) {
  return (
    <MenuItemsContext.Provider value={items}>
      {children}
    </MenuItemsContext.Provider>
  );
}

export function useMenuItems(): AntMenuItem[] {
  return useContext(MenuItemsContext);
}
