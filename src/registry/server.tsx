import React, { type ComponentType } from "react";
import { notFound } from "next/navigation";
import { moduleRegistry, type ModulePageProps } from "./registry";
import { SidebarItemsProvider } from "./client";

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
  modulesContext?: ReturnType<typeof require.context>;
}

/**
 * Factory function to create page exports.
 */
export function createPage(options: CreatePageOptions = {}) {
  const { modulesContext } = options;

  if (modulesContext) {
    modulesContext.keys().forEach((key) => modulesContext(key));
  }

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

// ============================================================================
// Layout Factory
// ============================================================================

export interface CreateLayoutOptions {
  modulesContext: ReturnType<typeof require.context>;
}

/**
 * Factory function to create layout exports with sidebar items from modules.
 */
export function createLayout(options: CreateLayoutOptions) {
  const { modulesContext } = options;

  modulesContext.keys().forEach((key) => modulesContext(key));

  const sidebarItems = moduleRegistry.getSidebarItems();

  function Layout({ children }: { children: React.ReactNode }) {
    return <SidebarItemsProvider items={sidebarItems}>{children}</SidebarItemsProvider>;
  }

  return { Layout, sidebarItems };
}
