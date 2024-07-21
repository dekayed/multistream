import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

export type Favorite = {
  name: string;
  url: string;
}

type FavoritesStore = {
  list: Array<Favorite>;
  add: (f: Favorite) => void;
  remove: (url: Favorite['url']) => void;
  removeMultiple: (urls: Array<Favorite['url']>) => void;
}

export const useFavorites = create(
  persist(
    subscribeWithSelector<FavoritesStore>(
      (set) => ({
        list: [],
        add: (favorite) => set((state) => ({ list: [...state.list, favorite] })),
        remove: (url) => set((state) => ({ list: state.list.filter((item) => item.url !== url) })),
        removeMultiple: (urls) => set((state) => ({ list: state.list.filter((item) => !urls.includes(item.url)) })),
      })
    ),
    { name: 'favorites' }
  )
);