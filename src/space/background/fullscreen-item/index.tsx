import { ContextMenuItem } from "components/ui/context-menu";

export function FullscreenItem() {
  if (document.fullscreenElement === document.documentElement) {
    return (
      <ContextMenuItem inset onClick={() => document.exitFullscreen()}>
        Exit Fullscreen
      </ContextMenuItem>
    );
  }

  return (
    <ContextMenuItem inset onClick={() => document.documentElement.requestFullscreen()}>
      Go Fullscreen
    </ContextMenuItem>
  );
}