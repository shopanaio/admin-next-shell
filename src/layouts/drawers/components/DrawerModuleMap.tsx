import { DrawerTypes } from '../types';
import { ProductDrawer } from './ProductDrawer';
import { CategoryDrawer } from './CategoryDrawer';

export const DrawerModuleMap = {
  [DrawerTypes.PRODUCT]: ProductDrawer,
  [DrawerTypes.CATEGORY]: CategoryDrawer,
};
