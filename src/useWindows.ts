import AES from "crypto-js/aes";
import utf8 from "crypto-js/enc-utf8";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import { router } from "router";

const secret = 'secret';

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

const url = new URL(location.href);
const enc = url.pathname.slice(1);
const stack = enc.length ? JSON.parse(AES.decrypt(decodeURIComponent(enc), secret).toString(utf8)) : [];

export const useWindows = create(
  subscribeWithSelector<WindowsStore>(
    (set) => ({
      stack: stack as Array<Window>,
      editing: !stack.length,
      create: (url?: Window['url']) => set((state) => ({ stack: [...state.stack, new Window(url || '')] })),
      update: (id, params) => set((state) => ({ stack: state.stack.map((media) => media.id === id ? ({ ...media, ...params }) : media) })),
      remove: (id) => set((state) => ({ stack: state.stack.filter((media) => media.id !== id) })),
      putOnTop: (id) => set((state) => ({ stack: state.stack.sort((a, b) => a.id === id ? 1 : b.id === id ? -1 : 0) })),
      toggleEditing: () => set((state) => ({ editing: !state.editing })),
    })
  )
);

useWindows.subscribe((state) => state.stack, (stack) => {
  const encrypted = stack.length ? AES.encrypt(JSON.stringify(stack), secret).toString() : '';

  router.navigate(`/${encodeURIComponent(encrypted)}`);
});