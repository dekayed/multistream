import { useState } from 'react';

import {
  ContextMenu as SCNContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuItem,
} from 'components/ui/context-menu';
import { useWindows, type Window } from 'stores/useWindows';

import { AddStreamItem } from './add-stream-item';
import { FullscreenItem } from './fullscreen-item';
import { LayoutItem } from './layout-item';
import { AddLayoutDialog } from './layout-item/add-dialog';
import { RemoveLayoutsDialog } from './layout-item/remove-dialog';

type Props = {
  onAdd: (url?: Window['url']) => void;
  isEditing: boolean;
  toggleEditing: () => void;
};

export function ContextMenu(props: Props) {
  const { onAdd, isEditing, toggleEditing } = props;

  const windows = useWindows();

  const [addLayoutOpen, setAddLayoutOpen] = useState(false);
  const [removeLayoutsOpen, setRemoveLayoutsOpen] = useState(true);

  return (
    <>
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
          <LayoutItem
            onAdd={() => setAddLayoutOpen(true)}
            onRemove={() => setRemoveLayoutsOpen(true)}
          />
          <ContextMenuSeparator />
          <FullscreenItem />
          {windows.stack.length > 0 && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem inset onClick={windows.removeAll} className="text-red-400 focus:text-red-400 focus:bg-red-900">
                Clear Space
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </SCNContextMenu>
      <AddLayoutDialog open={addLayoutOpen} setOpen={setAddLayoutOpen} />
      <RemoveLayoutsDialog open={removeLayoutsOpen} setOpen={setRemoveLayoutsOpen} />
    </>
  );
}