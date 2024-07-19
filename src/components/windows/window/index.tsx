import { Media } from "useMediaStore";
import { motion, useAnimationControls } from "framer-motion";
import { RefObject, useContext, useEffect, useRef } from "react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "components/ui/context-menu";
import { Context } from "context";


const hosts = {
  twitch: ['twitch.tv', 'www.twitch.tv'],
};

const players: Record<keyof typeof hosts, (videoId: string) => string> = {
  twitch: (videoId) => {
    const url = new URL("https://player.twitch.tv/?parent=localhost");
    url.searchParams.set('channel', videoId);
    return url.toString();
  },
};

type Props = {
  media: Media;
  boundaries: RefObject<HTMLDivElement>;
};

export function Window(props: Props) {
  const { media, boundaries } = props;

  const windowRef = useRef<HTMLDivElement>(null);
  const mediaStore = useContext(Context)!;

  const controls = useAnimationControls();

  const getIframeSrc = (media: Media) => {
    if (media.url === "") return null;
    try {
      const url = new URL(media.url);

      const host = Object.entries(hosts).find(([_, hosts]) => hosts.includes(url.host))?.[0] as keyof typeof hosts | undefined;

      if (host === 'twitch') {
        const videoId = url.pathname.split('/').pop();
        if (videoId) {
          return players['twitch'](videoId);
        }
      }

      return null;
    } catch { return null; }
    // return "https://player.twitch.tv/?channel=melharucos&parent=localhost";
  };

  const src = getIframeSrc(media);

  const snapToCenter = () => {
    const boundariesRect = boundaries.current?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };

    controls.start({
      x: (boundariesRect.width - windowRef.current!.getBoundingClientRect().width) / 2,
      y: (boundariesRect.height - windowRef.current!.getBoundingClientRect().height) / 2,
      transition: { type: 'spring', bounce: 0 },
    });
  };

  useEffect(() => {
    const boundariesRect = boundaries.current?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };

    const observer = new ResizeObserver(([entry]) => {
      const lowVerticalSpace = entry.contentRect.height < (entry.contentRect.width / 16 * 9);

      windowRef.current!.style.width = lowVerticalSpace ? 'auto' : '85%';
      windowRef.current!.style.height = lowVerticalSpace ? '85%' : 'auto';
    });

    const lowVerticalSpace = boundariesRect.height < (boundariesRect.width / 16 * 9);
    windowRef.current!.style.width = lowVerticalSpace ? 'auto' : '85%';
    windowRef.current!.style.height = lowVerticalSpace ? '85%' : 'auto';

    observer.observe(boundaries.current!);

    controls.set({
      x: (boundariesRect.width - windowRef.current!.getBoundingClientRect().width) / 2,
      y: (boundariesRect.height - windowRef.current!.getBoundingClientRect().height) / 2
    });

    controls.start({
      opacity: 1,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <motion.div
          drag
          dragConstraints={boundaries}
          dragElastic={0.5}
          className="absolute cursor-grab max-w-dvw max-h-dvh bg-neutral-200 aspect-video rounded-[1.9rem] overflow-hidden shadow-lg"
          whileDrag={{ cursor: 'grabbing' }}
          initial={{ opacity: 0 }}
          animate={controls}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: .3 }}
          ref={windowRef}
        >
          {src && (
            <iframe
              src={src}
              className="absolute inset-0 aspect-video"
            />
          )}
        </motion.div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset onClick={snapToCenter}>
          Snap to Center
        </ContextMenuItem>
        <ContextMenuItem inset onClick={() => mediaStore.removeMedia(media.id)} className="text-red-400 focus:text-red-400 focus:bg-red-900">
          Remove
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}