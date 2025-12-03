import { create } from 'zustand';
import { IEntityDrawerItem } from '../types';

interface IDrawersState {
  drawers: IEntityDrawerItem[];
  addDrawer: (payload: Omit<IEntityDrawerItem, 'uuid'>) => void;
  removeDrawer: (uuid: string) => void;
  setDirty: (uuid: string, isDirty: boolean) => void;
  updateDrawer: (payload: Partial<IEntityDrawerItem> & { uuid: string }) => void;
}

export const useDrawersStore = create<IDrawersState>((set) => ({
  drawers: [],

  addDrawer: (payload) =>
    set((state) => ({
      drawers: [
        ...state.drawers,
        {
          ...payload,
          uuid: crypto.randomUUID(),
        },
      ],
    })),

  removeDrawer: (uuid) =>
    set((state) => {
      const itemIdx = state.drawers.findIndex((it) => it.uuid === uuid);
      if (itemIdx === -1) return state;
      return { drawers: state.drawers.slice(0, itemIdx) };
    }),

  setDirty: (uuid, isDirty) =>
    set((state) => ({
      drawers: state.drawers.map((it) =>
        it.uuid === uuid ? { ...it, isDirty } : it
      ),
    })),

  updateDrawer: (payload) =>
    set((state) => ({
      drawers: state.drawers.map((it) =>
        it.uuid === payload.uuid ? { ...it, ...payload } : it
      ),
    })),
}));
