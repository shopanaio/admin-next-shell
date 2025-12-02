import { IEntityDrawerItem } from '@/layouts/drawers/types';
import { createContext, useContext } from 'react';

export const EntityDrawersContext = createContext<IEntityDrawerItem | undefined>(
  undefined,
);

export const useEntityDrawer = (): IEntityDrawerItem => {
  const context = useContext(EntityDrawersContext);

  if (context === undefined) {
    throw new Error(
      'useEntityDrawer must be used within a EntityDrawersProvider',
    );
  }

  return context;
};
