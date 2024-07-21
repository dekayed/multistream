import { ContextMenuItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from 'components/ui/context-menu';
import { useFavorites } from 'stores/useFavorites';
import type { Window } from 'stores/useWindows';

type Props = {
  onAdd: (url?: Window['url']) => void;
  onRemove: () => void;
}

export function AddStreamItem(props: Props) {
  const { onAdd, onRemove } = props;

  const favorites = useFavorites();

  if (favorites.list.length === 0) {
    return (
      <ContextMenuItem inset onClick={() => onAdd()}>
        Add a Stream
      </ContextMenuItem>
    );
  }

  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger inset onClick={() => onAdd()}>Add a Stream</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuItem onClick={() => onAdd()}>
          Empty
        </ContextMenuItem>
        <ContextMenuSeparator />
        {favorites.list.map((f) => (
          <ContextMenuItem key={f.url} onClick={() => onAdd(f.url)}>
            {f.name}
          </ContextMenuItem>
        ))}
        {favorites.list.length > 0 && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={onRemove} className="text-red-400 focus:text-red-400">
              Remove Favorites...
            </ContextMenuItem>
          </>
        )}
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}