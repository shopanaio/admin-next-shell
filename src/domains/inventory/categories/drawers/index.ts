import dynamic from 'next/dynamic';
import { registerDrawer } from '@/layouts/drawers';

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
