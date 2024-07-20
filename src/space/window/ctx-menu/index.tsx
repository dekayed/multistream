import { PropsWithChildren } from "react";

import { ContextMenu as SCNContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuCheckboxItem } from "components/ui/context-menu";
import { DialogTrigger } from "components/ui/dialog";
import { Favorite } from "useFavorites";

import { AddFavoriteDialog } from "./add-favorite";

type Props = {
  showResetResize: boolean;
  isFavorite: boolean;
  url: Favorite['url'];
  addFavorite: (name: Favorite['name']) => void;
  removeFavorite: () => void;
  onSnapToCenter: () => void;
  onResetResize: () => void;
  onRemove: () => void;
} & PropsWithChildren

export function ContextMenu(props: Props) {
  const { showResetResize, url, onSnapToCenter, onResetResize, isFavorite, addFavorite, removeFavorite, onRemove, children } = props;

  return (
    <AddFavoriteDialog url={url} onSubmit={addFavorite}>
      <SCNContextMenu>
        <ContextMenuTrigger>
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          {isFavorite ? (
            <ContextMenuCheckboxItem checked onClick={removeFavorite}>
              Favorite
            </ContextMenuCheckboxItem>
          ) : (
            <DialogTrigger asChild>
              <ContextMenuCheckboxItem>Favorite</ContextMenuCheckboxItem>
            </DialogTrigger>
          )}
          <ContextMenuItem inset onClick={onSnapToCenter}>
            Snap to Center
          </ContextMenuItem>
          {showResetResize && (
            <ContextMenuItem inset onClick={onResetResize}>
              Reset Size
            </ContextMenuItem>
          )}
          <ContextMenuItem inset onClick={onRemove} className="text-red-400 focus:text-red-400 focus:bg-red-900">
            Remove
          </ContextMenuItem>
        </ContextMenuContent>
      </SCNContextMenu>
    </AddFavoriteDialog>
  );
}