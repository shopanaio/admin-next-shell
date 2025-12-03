import React from 'react';
import type { ComponentType } from 'react';
import { match, type MatchFunction, type ParamData } from 'path-to-regexp';
import { notFound } from 'next/navigation';

export type { ParamData };

/**
 * Async component loader.
 */
export type AsyncComponentLoader<T = unknown> = () => Promise<T> | T;

/**
 * Configuration for registering a page module.
 */
export interface ModuleConfig<T = unknown> {
  path: string;
  component: AsyncComponentLoader<T>;
}

/**
 * Record held inside the registry.
 */
export interface RegisteredModuleRecord<T = unknown> extends ModuleConfig<T> {
  matcher: MatchFunction<ParamData>;
}

/**
 * Result of a successful module match.
 */
export interface ModuleMatchResult<T = unknown> {
  record: RegisteredModuleRecord<T>;
  params: ParamData;
}

/**
 * Props contract for module page components.
 */
export interface ModulePageProps {
  params: { slug?: string[] };
  searchParams?: Record<string, string | string[] | undefined>;
  pathParams: ParamData;
}

/**
 * Common shape of a module export.
 */
export type ModuleExport<TProps> =
  | { default: ComponentType<TProps> }
  | ComponentType<TProps>;

/**
 * Module Registry for dynamic page module resolution.
 */
export class ModuleRegistry {
  private readonly records: RegisteredModuleRecord[] = [];

  register<T = unknown>(config: ModuleConfig<T>): void {
    const { path, component } = config;
    const matcher = match(path, { decode: decodeURIComponent });
    const record: RegisteredModuleRecord<T> = { path, component, matcher };
    this.records.push(record);
  }

  matchPath<T = unknown>(pathname: string): ModuleMatchResult<T> | undefined {
    for (const record of this.records) {
      const result = record.matcher(pathname);
      if (result) {
        return {
          record: record as RegisteredModuleRecord<T>,
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
export function registerModule<T = unknown>(config: ModuleConfig<T>): void {
  moduleRegistry.register(config);
}

// ============================================================================
// Page Factory
// ============================================================================

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function getComponentFromModule(
  input: ModuleExport<ModulePageProps>
): React.ComponentType<ModulePageProps> {
  if (input && typeof input === 'object' && 'default' in input) {
    return (input as { default: React.ComponentType<ModulePageProps> }).default;
  }
  return input as React.ComponentType<ModulePageProps>;
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
    const pathname = '/' + segments.join('/');

    const matchResult = moduleRegistry.matchPath<ModuleExport<ModulePageProps>>(pathname);

    if (!matchResult) {
      notFound();
    }

    const rawSearchParams = await props.searchParams;
    const searchParams = rawSearchParams ? { ...rawSearchParams } : {};

    const modulePayload = await matchResult.record.component();

    return React.createElement(getComponentFromModule(modulePayload), {
      params: { slug: segments },
      searchParams,
      pathParams: matchResult.params ? { ...matchResult.params } : {},
    });
  }

  return { Page };
}
