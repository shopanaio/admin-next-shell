// Shared types and registry
export {
  type ParamData,
  type ModulePageProps,
  type ModuleSidebarItem,
  type SidebarItem,
  type DomainConfig,
  type ModuleConfig,
  type RegisteredModuleRecord,
  type ModuleMatchResult,
  ModuleRegistry,
  moduleRegistry,
  registerDomain,
  registerModule,
} from "./registry";

// Server-side factories
export {
  type CreatePageOptions,
  type CreateLayoutOptions,
  createPage,
  createLayout,
} from "./server";

// Client-side context and hooks
export { SidebarItemsProvider, useSidebarItems } from "./client";
