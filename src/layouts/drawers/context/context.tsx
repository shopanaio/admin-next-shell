import { createContext } from 'react';
import { IEntityDrawerItem } from '../types';

export const EntityDrawersContext = createContext<IEntityDrawerItem | undefined>(
  undefined,
);
