import type { ComponentType } from "react";
import { match, type MatchFunction, type ParamData } from "path-to-regexp";

export type { ParamData };

/**
 * Props contract for module page components.
 */
export interface ModulePageProps {
  params: { slug?: string[] };
  searchParams?: Record<string, string | string[] | undefined>;
  pathParams: ParamData;
}

/**
 * Sidebar item configuration.
 */
export interface SidebarItem {
  key: string;
  label: string;
  icon?: ComponentType;
  order?: number;
  type?: "group";
  children?: SidebarItem[];
}

/**
 * Configuration for registering a page module.
 */
export interface ModuleConfig {
  path: string;
  component: ComponentType<ModulePageProps>;
  sidebar?: SidebarItem;
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
    const { path, component, sidebar } = config;
    const matcher = match(path, { decode: decodeURIComponent });
    const record: RegisteredModuleRecord = { path, component, sidebar, matcher };
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

  getSidebarItems(): SidebarItem[] {
    return this.records
      .filter((r) => r.sidebar)
      .map((r) => r.sidebar!)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
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
