import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from "components/ui/context-menu";
import { Window } from "useWindows";

import { AddStreamItem } from "./add-stream-item";
import { FullscreenItem } from "./fullscreen-item";

type Props = {
  onAdd: (url?: Window['url']) => void;
  isEditing: boolean;
  toggleEditing: () => void;
};

export function Background(props: Props) {
  const { onAdd, isEditing, toggleEditing } = props;

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="w-full h-full absolute inset-0 z-0" />
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <AddStreamItem onAdd={onAdd} />
        <ContextMenuCheckboxItem checked={isEditing} onClick={toggleEditing}>
          Ediitng Mode
        </ContextMenuCheckboxItem>
        <FullscreenItem />
      </ContextMenuContent>
    </ContextMenu>
  );
}