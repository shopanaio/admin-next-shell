import type { ComponentType, ReactNode } from "react";
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
 * Sidebar item configuration for modules.
 */
export interface ModuleSidebarItem {
  label: string;
  order?: number;
}

/**
 * Sidebar item for rendering (with children).
 */
export interface SidebarItem {
  key: string;
  label: string;
  icon?: ReactNode;
  order?: number;
  children?: SidebarItem[];
}

/**
 * Configuration for registering a domain (group of modules).
 */
export interface DomainConfig {
  key: string;
  label: string;
  icon?: ReactNode;
  order?: number;
}

/**
 * Configuration for registering a page module.
 */
export interface ModuleConfig {
  key: string;
  domain: string;
  path: string;
  component: ComponentType<ModulePageProps>;
  sidebar?: ModuleSidebarItem;
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
  private readonly domains: Map<string, DomainConfig> = new Map();
  private readonly records: RegisteredModuleRecord[] = [];

  registerDomain(config: DomainConfig): void {
    this.domains.set(config.key, config);
  }

  register(config: ModuleConfig): void {
    const { path, component, sidebar, key, domain } = config;
    const matcher = match(path, { decode: decodeURIComponent });
    const record: RegisteredModuleRecord = { key, domain, path, component, sidebar, matcher };
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
    const result: SidebarItem[] = [];

    // Group modules by domain
    const modulesByDomain = new Map<string, RegisteredModuleRecord[]>();
    for (const record of this.records) {
      if (!record.sidebar) continue;
      const existing = modulesByDomain.get(record.domain) ?? [];
      existing.push(record);
      modulesByDomain.set(record.domain, existing);
    }

    // Build sidebar items from domains
    const sortedDomains = Array.from(this.domains.values())
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    for (const domain of sortedDomains) {
      const modules = modulesByDomain.get(domain.key) ?? [];
      const children = modules
        .filter((m) => m.sidebar)
        .sort((a, b) => (a.sidebar!.order ?? 0) - (b.sidebar!.order ?? 0))
        .map((m) => ({
          key: m.key,
          label: m.sidebar!.label,
        }));

      result.push({
        key: domain.key,
        label: domain.label,
        icon: domain.icon,
        children: children.length > 0 ? children : undefined,
      });
    }

    return result;
  }
}

/**
 * Global singleton registry instance.
 */
export const moduleRegistry = new ModuleRegistry();

/**
 * Helper to register a domain.
 */
export function registerDomain(config: DomainConfig): void {
  moduleRegistry.registerDomain(config);
}

/**
 * Helper to register modules.
 */
export function registerModule(config: ModuleConfig): void {
  moduleRegistry.register(config);
}
