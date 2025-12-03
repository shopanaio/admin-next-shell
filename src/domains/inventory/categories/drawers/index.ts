import dynamic from 'next/dynamic';
import { registerDrawer, createDrawerHook } from '@/layouts/drawers';
import type { CategoryDrawerPayload } from './types';

// Re-export types
export type { CategoryDrawerPayload } from './types';

/**
 * Register category drawers
 */
export function registerCategoryDrawers() {
  registerDrawer({
    type: 'category',
    component: dynamic(() =>
      import('./CategoryDrawer').then((m) => m.CategoryDrawer)
    ),
    width: 'calc(100vw - 100px)',
    confirmOnDirtyClose: true,
  });
}

/**
 * Typed hook for opening category drawer
 */
export const useCategoryDrawer =
  createDrawerHook<CategoryDrawerPayload>('category');
