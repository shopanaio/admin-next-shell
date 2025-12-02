import { ComponentType } from 'react';
import { IEntityDrawerItem } from '@/layouts/drawers/types';

// Map of drawer types to their corresponding components
// Add your drawer components here as needed
export const DrawerModuleMap: Record<string, ComponentType<IEntityDrawerItem>> = {
  // Example:
  // PRODUCT: ProductForm,
  // CATEGORY: CategoryForm,
};
