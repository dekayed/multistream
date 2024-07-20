import { PropsWithChildren } from "react";

import { ContextMenu as SCNContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "components/ui/context-menu";

type Props = {
  showResetResize: boolean;
  onSnapToCenter: () => void;
  onResetResize: () => void;
  onRemove: () => void;
} & PropsWithChildren

export function ContextMenu(props: Props) {
  const { showResetResize, onSnapToCenter, onResetResize, onRemove, children } = props;

  return (
    <SCNContextMenu>
      <ContextMenuTrigger>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
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
  );
}