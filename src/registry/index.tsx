import React from "react";
import type { ComponentType } from "react";
import { match, type MatchFunction, type ParamData } from "path-to-regexp";
import { notFound } from "next/navigation";

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
 * Configuration for registering a page module.
 */
export interface ModuleConfig {
  path: string;
  component: ComponentType<ModulePageProps>;
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
    const { path, component } = config;
    const matcher = match(path, { decode: decodeURIComponent });
    const record: RegisteredModuleRecord = { path, component, matcher };
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

// ============================================================================
// Page Factory
// ============================================================================

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function renderComponent(
  Component: ComponentType<ModulePageProps>,
  props: ModulePageProps
): React.ReactElement {
  return <Component {...props} />;
}

export interface CreatePageOptions {
  modulesContext: ReturnType<typeof require.context>;
}

/**
 * Factory function to create page exports.
 *
 * @example
 * ```tsx
 * // app/[...slug]/page.tsx
 * import { createPage } from '@/registry';
 *
 * const { Page } = createPage({
 *   modulesContext: require.context('../../modules', true, /register\.(t|j)sx?$/),
 * });
 *
 * export default Page;
 * ```
 */
export function createPage(options: CreatePageOptions) {
  const { modulesContext } = options;

  modulesContext.keys().forEach((key) => modulesContext(key));

  async function Page(props: PageProps) {
    const params = await props.params;
    const segments = params.slug ?? [];
    const pathname = "/" + segments.join("/");

    const matchResult = moduleRegistry.matchPath(pathname);

    if (!matchResult) {
      notFound();
    }

    const rawSearchParams = await props.searchParams;
    const searchParams = rawSearchParams ? { ...rawSearchParams } : {};

    const Component = matchResult.record.component;

    return renderComponent(Component, {
      params: { slug: segments },
      searchParams,
      pathParams: matchResult.params ? { ...matchResult.params } : {},
    });
  }

  return { Page };
}
