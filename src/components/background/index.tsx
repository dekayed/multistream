import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "components/ui/context-menu";
import { useEffect, useState } from "react";

type Props = {
  onAdd: () => void;
  isEditing: boolean;
  toggleEditing: () => void;
};

export function Background(props: Props) {
  const { onAdd, isEditing, toggleEditing } = props;

  const [fullscreenElement, setFullscreenElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      setFullscreenElement(document.fullscreenElement as HTMLElement);
    });
  }, []);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="w-full h-full absolute inset-0 z-0" />
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset onClick={onAdd}>
          Add a Stream
        </ContextMenuItem>
        {/* <ContextMenuCheckboxItem checked>
          Rounded Windows
        </ContextMenuCheckboxItem> */}
        <ContextMenuCheckboxItem checked={isEditing} onClick={toggleEditing}>
          Ediitng Mode
        </ContextMenuCheckboxItem>
        {fullscreenElement === document.documentElement ? (
          <ContextMenuItem inset onClick={() => document.exitFullscreen()}>
            Exit Fullscreen
          </ContextMenuItem>
        ) : (
          <ContextMenuItem inset onClick={() => document.documentElement.requestFullscreen()}>
            Go Fullscreen
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}