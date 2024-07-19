import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "components/ui/context-menu";

type Props = {
  onAdd: () => void;
};

export function Background(props: Props) {
  const { onAdd } = props;
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="w-full h-full absolute inset-0 z-0" />
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset onClick={onAdd}>
          Add a Stream
          <ContextMenuShortcut>⌘N</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuCheckboxItem checked>
          Rounded Windows
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem checked>
          Ediitng Mode
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}