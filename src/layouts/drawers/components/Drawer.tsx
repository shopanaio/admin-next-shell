import { App, Drawer } from 'antd';
import { ReactNode, Suspense, useEffect, useState } from 'react';

import { IEntityDrawerItem } from '@/layouts/drawers/types';
import { EntityDrawersProvider } from '@/layouts/drawers/components/Provider';
import { DrawerModuleMap } from '@/layouts/drawers/components/DrawerModuleMap';

interface IEntityDrawerProps {
  children?: ReactNode;
  level: number;
  drawerItem: IEntityDrawerItem;
  onRemove?: (uuid: string) => void;
  onUpdate?: (item: Partial<IEntityDrawerItem>) => void;
  unsavedChangesTitle?: string;
  unsavedChangesContent?: string;
}

export const EntityDrawer = ({
  children = null,
  drawerItem,
  onRemove,
  onUpdate,
  unsavedChangesTitle = 'Unsaved changes',
  unsavedChangesContent = 'You have unsaved changes. Are you sure you want to leave?',
}: IEntityDrawerProps) => {
  const { type, uuid, isDirty } = drawerItem;
  const [isOpen, setIsOpen] = useState(true);
  const { modal } = App.useApp();

  const clearAfterClose = (isOpen: boolean) => {
    if (isOpen) {
      return;
    }
    onRemove?.(uuid);
  };

  useEffect(() => () => setIsOpen(false), []);

  const onClose = async () => {
    if (isDirty) {
      const result = await modal.confirm({
        icon: null,
        okButtonProps: {
          'data-testid': 'drawer-confirm-leave',
        },
        cancelButtonProps: {
          'data-testid': 'drawer-cancel-leave',
        },
        title: unsavedChangesTitle,
        content: unsavedChangesContent,
      });

      if (!result) {
        return;
      }
    }

    setIsOpen(false);
  };

  const onForceClose = () => {
    setIsOpen(false);
  };

  const handleUpdate = (nextItem: Partial<IEntityDrawerItem>) => {
    onUpdate?.({ uuid, ...nextItem });
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
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <Suspense fallback={null}>
        <EntityDrawersProvider
          onClose={onClose}
          onForceClose={onForceClose}
          drawerItem={drawerItem}
          onUpdate={handleUpdate}
        >
          <Module {...drawerItem} />
        </EntityDrawersProvider>
      </Suspense>
      {children}
    </Drawer>
  );
};
