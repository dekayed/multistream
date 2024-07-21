import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

export type Layout = {
  name: string;
  key: string;
}

type LayoutsStore = {
  list: Array<Layout>;
  add: (f: Layout) => void;
  remove: (key: Layout['key']) => void;
}

export const useLayouts = create(
  persist(
    subscribeWithSelector<LayoutsStore>(
      (set) => ({
        list: [],
        add: (layout) => set((state) => ({ list: [...state.list, layout] })),
        remove: (key) => set((state) => ({ list: state.list.filter((item) => item.key !== key) })),
      })
    ),
    { name: 'layouts' }
  )
);