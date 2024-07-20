import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "components/ui/context-menu";
import { FullscreenItem } from "./fullscreen-item";

type Props = {
  onAdd: () => void;
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
        <ContextMenuItem inset onClick={onAdd}>
          Add a Stream
        </ContextMenuItem>
        <ContextMenuCheckboxItem checked={isEditing} onClick={toggleEditing}>
          Ediitng Mode
        </ContextMenuCheckboxItem>
        <FullscreenItem />
      </ContextMenuContent>
    </ContextMenu>
  );
}