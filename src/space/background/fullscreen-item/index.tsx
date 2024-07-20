import { ContextMenuItem } from "components/ui/context-menu";
import { useEffect, useState } from "react";

export function FullscreenItem() {
  const [fullscreenElement, setFullscreenElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      setFullscreenElement(document.fullscreenElement as HTMLElement);
    });
  }, []);

  if (fullscreenElement === document.documentElement) {
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