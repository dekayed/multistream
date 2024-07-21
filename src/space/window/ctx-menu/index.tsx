import type { PropsWithChildren } from 'react';

import { ContextMenu as SCNContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuCheckboxItem, ContextMenuSeparator } from 'components/ui/context-menu';
import { DialogTrigger } from 'components/ui/dialog';
import { getHost } from 'parsers';
import { getChatUrl } from 'parsers/twitch';
import twitchChatParser from 'parsers/twitch-chat';
import type { Favorite } from 'stores/useFavorites';
import { useWindows } from 'stores/useWindows';

import { AddFavoriteDialog } from './add-favorite';

type Props = {
  showResetResize: boolean;
  isFavorite: boolean;
  url: Favorite['url'];
  addFavorite: (name: Favorite['name']) => void;
  removeFavorite: () => void;
  onSnapToCenter: () => void;
  onResetResize: () => void;
  onRemove: () => void;
  aspectRatioLocked?: boolean;
  onToggleAspectRatioLock?: () => void;
} & PropsWithChildren

export function ContextMenu(props: Props) {
  const {
    showResetResize, url, onSnapToCenter, onResetResize, isFavorite,
    addFavorite, removeFavorite, onRemove, children,
    aspectRatioLocked, onToggleAspectRatioLock,
  } = props;

  const windows = useWindows();

  return (
    <AddFavoriteDialog url={url} onSubmit={addFavorite}>
      <SCNContextMenu>
        <ContextMenuTrigger>
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          {getHost(url) === 'twitch' && (
            <>
              <ContextMenuItem inset onClick={() => windows.create({ url: twitchChatParser(getChatUrl(url)), width: 25, height: 95 })}>
                Open Twitch Chat
              </ContextMenuItem>
              <ContextMenuSeparator />
            </>
          )}
          {isFavorite ? (
            <ContextMenuCheckboxItem checked onClick={removeFavorite}>
              Favorite
            </ContextMenuCheckboxItem>
          ) : (
            <DialogTrigger asChild>
              <ContextMenuCheckboxItem>Favorite</ContextMenuCheckboxItem>
            </DialogTrigger>
          )}
          {typeof aspectRatioLocked === 'boolean' && (
            <ContextMenuCheckboxItem checked={aspectRatioLocked} onClick={onToggleAspectRatioLock}>
              Lock Aspect Ratio
            </ContextMenuCheckboxItem>
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