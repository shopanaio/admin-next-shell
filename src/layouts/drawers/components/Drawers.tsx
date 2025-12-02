import { EntityDrawer } from '@/layouts/drawers/components/Drawer';
import { IEntityDrawerItem } from '@/layouts/drawers/types';

interface IDrawersProps {
  items: IEntityDrawerItem[];
  level?: number;
  onRemove?: (uuid: string) => void;
  onUpdate?: (item: Partial<IEntityDrawerItem>) => void;
}

const NestedDrawers = ({ items, level = 0, onRemove, onUpdate }: IDrawersProps) => {
  const [current, ...rest] = items;

  const isCurrent = !rest?.length;

  return (
    <EntityDrawer drawerItem={current} level={level} onRemove={onRemove} onUpdate={onUpdate}>
      {!isCurrent && <NestedDrawers items={rest} level={level + 1} onRemove={onRemove} onUpdate={onUpdate} />}
    </EntityDrawer>
  );
};

interface DrawersProps {
  drawers: IEntityDrawerItem[];
  onRemove?: (uuid: string) => void;
  onUpdate?: (item: Partial<IEntityDrawerItem>) => void;
}

export const Drawers = ({ drawers, onRemove, onUpdate }: DrawersProps) => {
  if (!drawers.length) {
    return null;
  }

  return <NestedDrawers items={drawers} onRemove={onRemove} onUpdate={onUpdate} />;
};
