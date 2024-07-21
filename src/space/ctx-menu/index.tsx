import {
  ContextMenu as SCNContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from 'components/ui/context-menu';
import type { Window } from 'stores/useWindows';

import { AddStreamItem } from './add-stream-item';
import { FullscreenItem } from './fullscreen-item';

type Props = {
  onAdd: (url?: Window['url']) => void;
  isEditing: boolean;
  toggleEditing: () => void;
};

export function ContextMenu(props: Props) {
  const { onAdd, isEditing, toggleEditing } = props;

  return (
    <SCNContextMenu>
      <ContextMenuTrigger>
        <div className="w-full h-full absolute inset-0 z-0" />
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuCheckboxItem checked={isEditing} onClick={toggleEditing}>
          Editing Mode
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <AddStreamItem onAdd={onAdd} />
        <ContextMenuSeparator />
        <FullscreenItem />
      </ContextMenuContent>
    </SCNContextMenu>
  );
}