import { ReactNode } from 'react';
import { EntityDrawersContext } from '../context/context';
import { IEntityDrawerItem } from '../types';

interface IProviderProps {
  children: ReactNode;
  drawerItem: IEntityDrawerItem;
  onClose: () => void;
  onForceClose: () => void;
  onUpdate: (nextItem: Partial<IEntityDrawerItem>) => void;
}

export const EntityDrawersProvider = ({
  children,
  drawerItem,
  onClose,
  onForceClose,
  onUpdate,
}: IProviderProps) => {
  return (
    <EntityDrawersContext.Provider
      value={{
        ...drawerItem,
        close: onClose,
        forceClose: onForceClose,
        update: onUpdate,
      }}
    >
      {children}
    </EntityDrawersContext.Provider>
  );
};
