import dynamic from 'next/dynamic';
import { registerDrawer, createDrawerHook } from '@/layouts/drawers';
import type { ProductDrawerPayload, ProductCreateDrawerPayload } from './types';

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

  // Product create drawer (example of additional drawer)
  // registerDrawer({
  //   type: 'product-create',
  //   component: dynamic(() =>
  //     import('./ProductCreateDrawer').then((m) => m.ProductCreateDrawer)
  //   ),
  //   width: 800,
  // });
}

/**
 * Typed hook for opening product drawer
 *
 * @example
 * ```tsx
 * const openProduct = useProductDrawer();
 * openProduct({ entityId: '123', mode: 'edit' });
 * ```
 */
export const useProductDrawer = createDrawerHook<ProductDrawerPayload>('product');

/**
 * Typed hook for opening product create drawer
 */
export const useProductCreateDrawer =
  createDrawerHook<ProductCreateDrawerPayload>('product-create');
