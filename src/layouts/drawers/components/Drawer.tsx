'use client';

import { App, Drawer } from 'antd';
import { ReactNode, Suspense, useState } from 'react';
import { IEntityDrawerItem } from '../types';
import { useDrawersStore } from '../store/drawers';
import { EntityDrawersProvider } from './Provider';
import { DrawerModuleMap } from './DrawerModuleMap';

interface IEntityDrawerProps {
  children?: ReactNode;
  level: number;
  drawerItem: IEntityDrawerItem;
}

export const EntityDrawer = ({
  children = null,
  drawerItem,
}: IEntityDrawerProps) => {
  const { type, uuid, isDirty } = drawerItem;
  const [isOpen, setIsOpen] = useState(true);
  const { modal } = App.useApp();
  const { removeDrawer, updateDrawer } = useDrawersStore();

  const clearAfterClose = (open: boolean) => {
    if (open) return;
    removeDrawer(uuid);
  };

  const onClose = async () => {
    if (isDirty) {
      const result = await modal.confirm({
        icon: null,
        title: 'Unsaved changes',
        content: 'You have unsaved changes. Are you sure you want to leave?',
      });
      if (!result) return;
    }
    setIsOpen(false);
  };

  const onForceClose = () => {
    setIsOpen(false);
  };

  const onUpdate = (nextItem: Partial<IEntityDrawerItem>) => {
    updateDrawer({ uuid, ...nextItem });
  };

  const Module = DrawerModuleMap[type];
  if (!Module) {
    console.error('Unknown drawer type:', type);
    return null;
  }

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      afterOpenChange={clearAfterClose}
      placement="right"
      width="calc(100vw - 100px)"
      push={{ distance: children ? 100 : 0 }}
      closeIcon={null}
      styles={{ body: { padding: 0 } }}
    >
      <Suspense fallback={null}>
        <EntityDrawersProvider
          onClose={onClose}
          onForceClose={onForceClose}
          drawerItem={drawerItem}
          onUpdate={onUpdate}
        >
          <Module />
        </EntityDrawersProvider>
      </Suspense>
      {children}
    </Drawer>
  );
};
