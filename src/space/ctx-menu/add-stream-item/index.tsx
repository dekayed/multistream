import { ContextMenuItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from 'components/ui/context-menu';
import { useFavorites } from 'useFavorites';
import type { Window } from 'useWindows';

type Props = {
  onAdd: (url?: Window['url']) => void;
}

export function AddStreamItem(props: Props) {
  const { onAdd } = props;

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
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}