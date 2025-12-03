// Shared types and registry
export {
  type ParamData,
  type ModulePageProps,
  type SidebarItem,
  type ModuleConfig,
  type RegisteredModuleRecord,
  type ModuleMatchResult,
  ModuleRegistry,
  moduleRegistry,
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
