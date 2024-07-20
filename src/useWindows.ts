import { create } from "zustand";

export class Window {
  id: string;
  url: string;

  constructor(url: string) {
    this.id = crypto.randomUUID();
    this.url = url;
  }
}

type WindowsStore = {
  stack: Array<Window>;
  editing: boolean;
  create: () => void;
  update: (id: Window['id'], params: Partial<Window>) => void;
  remove: (id: Window['id']) => void;
  putOnTop: (id: Window['id']) => void;
  toggleEditing: () => void;
};

export const useWindows = create<WindowsStore>((set) => ({
  stack: [] as Array<Window>,
  editing: true,
  create: () => set((state) => ({ stack: [...state.stack, new Window('')] })),
  update: (id, params) => set((state) => ({ stack: state.stack.map((media) => media.id === id ? ({ ...media, ...params }) : media) })),
  remove: (id) => set((state) => ({ stack: state.stack.filter((media) => media.id !== id) })),
  putOnTop: (id) => set((state) => ({ stack: state.stack.sort((a, b) => a.id === id ? 1 : b.id === id ? -1 : 0) })),
  toggleEditing: () => set((state) => ({ editing: !state.editing })),
}));