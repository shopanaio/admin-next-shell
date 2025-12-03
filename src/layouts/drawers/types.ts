export interface IEntityDrawerItem {
  entityId?: string | number;
  type: DrawerTypes;
  uuid: string;
  isDirty?: boolean;
  close?: () => void;
  forceClose?: () => void;
  update?: (nextItem: Partial<IEntityDrawerItem>) => void;
}

export enum DrawerTypes {
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
}
