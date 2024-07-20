import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

export type Favorite = {
  name: string;
  url: string;
}

type FavoritesStore = {
  list: Array<Favorite>;
  addFavorite: (f: Favorite) => void;
  removeFavorite: (url: Favorite['url']) => void;
}

export const useFavorites = create(
  persist(
    subscribeWithSelector<FavoritesStore>(
      (set) => ({
        list: JSON.parse(localStorage.getItem("favorites") || '[]'),
        addFavorite: (favorite) => set((state) => ({ list: [...state.list, favorite] })),
        removeFavorite: (url) => set((state) => ({ list: state.list.filter((item) => item.url !== url) })),
      })
    ),
    {
      name: "favorites"
    }
  )
);