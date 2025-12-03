/**
 * Inventory domain drawers registration
 * Import this file in your app initialization to register all inventory drawers
 */
import { registerProductDrawers } from './products/drawers';
import { registerCategoryDrawers } from './categories/drawers';

/**
 * Register all inventory domain drawers
 * Call this function during app initialization
 *
 * @example
 * ```tsx
 * // In app/providers.tsx or similar
 * import { registerInventoryDrawers } from '@/domains/inventory/drawers';
 *
 * registerInventoryDrawers();
 * ```
 */
export function registerInventoryDrawers() {
  registerProductDrawers();
  registerCategoryDrawers();
}

// Re-export individual registration functions for granular control
export { registerProductDrawers } from './products/drawers';
export { registerCategoryDrawers } from './categories/drawers';
