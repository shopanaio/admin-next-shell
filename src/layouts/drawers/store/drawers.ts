import { create } from 'zustand';
import { IEntityDrawerItem } from '@src/layouts/drawers/types';

interface IDrawersState {
  drawers: IEntityDrawerItem[];
}

interface IDrawersActions {
  addDrawer: (payload: Omit<IEntityDrawerItem, 'uuid'>) => void;
  removeDrawer: (uuid: string) => void;
  setDirty: (payload: { uuid: string; isDirty: boolean }) => void;
  updateDrawer: (payload: Partial<IEntityDrawerItem> & { uuid: string }) => void;
}

export const useDrawersStore = create<IDrawersState & IDrawersActions>((set) => ({
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

      if (itemIdx === -1) {
        return state;
      }

      return {
        /**
         * Array is sliced since all the next drawers should be removed as well
         */
        drawers: state.drawers.slice(0, itemIdx),
      };
    }),

  setDirty: (payload) =>
    set((state) => ({
      drawers: state.drawers.map((it) => {
        if (payload.uuid === it.uuid) {
          return { ...it, isDirty: payload.isDirty };
        }
        return it;
      }),
    })),

  updateDrawer: (payload) =>
    set((state) => ({
      drawers: state.drawers.map((it) => {
        if (payload.uuid === it.uuid) {
          return { ...it, ...payload };
        }
        return it;
      }),
    })),
}));
