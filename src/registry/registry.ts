import type { ComponentType, ReactNode } from "react";
import { match, type MatchFunction, type ParamData } from "path-to-regexp";
import type { MenuProps } from "antd";

export type { ParamData };

export type AntMenuItem = NonNullable<MenuProps["items"]>[number];

/**
 * Props contract for module page components.
 */
export interface ModulePageProps {
  params: { slug?: string[] };
  searchParams?: Record<string, string | string[] | undefined>;
  pathParams: ParamData;
}

/**
 * Menu item configuration for module sidebar navigation.
 */
export interface ModuleMenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  parentKey?: string;
  order?: number;
}

/**
 * Configuration for registering a page module.
 */
export interface ModuleConfig {
  path: string;
  component: ComponentType<ModulePageProps>;
  menuItem?: ModuleMenuItem;
}

/**
 * Record held inside the registry.
 */
export interface RegisteredModuleRecord extends ModuleConfig {
  matcher: MatchFunction<ParamData>;
}

/**
 * Result of a successful module match.
 */
export interface ModuleMatchResult {
  record: RegisteredModuleRecord;
  params: ParamData;
}

/**
 * Module Registry for dynamic page module resolution.
 */
export class ModuleRegistry {
  private readonly records: RegisteredModuleRecord[] = [];

  register(config: ModuleConfig): void {
    const { path, component, menuItem } = config;
    const matcher = match(path, { decode: decodeURIComponent });
    const record: RegisteredModuleRecord = { path, component, menuItem, matcher };
    this.records.push(record);
  }

  matchPath(pathname: string): ModuleMatchResult | undefined {
    for (const record of this.records) {
      const result = record.matcher(pathname);
      if (result) {
        return {
          record,
          params: result.params,
        };
      }
    }
    return undefined;
  }

  list(): string[] {
    return this.records.map((r) => r.path);
  }

  getMenuItems(): AntMenuItem[] {
    const menuItems = this.records
      .filter((r) => r.menuItem)
      .map((r) => r.menuItem!);

    const topLevel = menuItems.filter((item) => !item.parentKey);
    const children = menuItems.filter((item) => item.parentKey);

    const result: AntMenuItem[] = topLevel
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item) => {
        const itemChildren = children
          .filter((child) => child.parentKey === item.key)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((child) => ({
            key: child.key,
            label: child.label,
            icon: child.icon,
          }));

        if (itemChildren.length > 0) {
          return {
            key: item.key,
            label: item.label,
            icon: item.icon,
            children: itemChildren,
          };
        }

        return {
          key: item.key,
          label: item.label,
          icon: item.icon,
        };
      });

    return result;
  }
}

/**
 * Global singleton registry instance.
 */
export const moduleRegistry = new ModuleRegistry();

/**
 * Helper to register modules.
 */
export function registerModule(config: ModuleConfig): void {
  moduleRegistry.register(config);
}
