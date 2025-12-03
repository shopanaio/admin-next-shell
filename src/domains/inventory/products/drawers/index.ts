import dynamic from 'next/dynamic';
import { registerDrawer } from '@/layouts/drawers';

// Re-export types for convenience
export type { ProductDrawerPayload, ProductCreateDrawerPayload } from './types';

/**
 * Register product drawers
 * This function should be called during app initialization
 */
export function registerProductDrawers() {
  // Main product drawer - view/edit existing product
  registerDrawer({
    type: 'product',
    component: dynamic(() =>
      import('./ProductDrawer').then((m) => m.ProductDrawer)
    ),
    width: 'calc(100vw - 100px)',
    confirmOnDirtyClose: true,
  });
}
