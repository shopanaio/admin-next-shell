'use client';

import { EntityDrawer } from './Drawer';
import { useDrawersStore } from '../store/drawers';
import { IEntityDrawerItem } from '../types';

interface IDrawersProps {
  items: IEntityDrawerItem[];
  level?: number;
}

const NestedDrawers = ({ items, level = 0 }: IDrawersProps) => {
  const [current, ...rest] = items;

  const isCurrent = !rest?.length;

  return (
    <EntityDrawer drawerItem={current} level={level}>
      {!isCurrent && <NestedDrawers items={rest} level={level + 1} />}
    </EntityDrawer>
  );
};

export const Drawers = () => {
  const drawers = useDrawersStore((state) => state.drawers);

  if (!drawers.length) {
    return null;
  }

  return <NestedDrawers items={drawers} />;
};
