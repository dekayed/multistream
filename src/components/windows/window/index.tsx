import { Media } from "useMediaStore";
import { AnimatePresence, motion, PanInfo, useAnimationControls } from "framer-motion";
import { RefObject, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "components/ui/context-menu";
import { Context } from "context";
import { cn } from "utils";


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
  zIndex?: number;
  isEditing?: boolean;
};

export function Window(props: Props) {
  const { media, boundaries, zIndex = 0, isEditing } = props;

  const [resized, setResized] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [inputValue, setInputValue] = useState(media.url);

  const windowRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
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

  const getBoundariesRect = () => boundaries.current?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };

  const handleResize = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const shouldChangeHeight = windowRef.current!.style.width === 'auto';
    const boundariesRect = getBoundariesRect();

    if (shouldChangeHeight) {
      const newHeight = info.delta.y / boundariesRect.height * 100;
      controls.set({
        height: `${parseFloat(windowRef.current!.style.height) + newHeight}%`
      });
      // windowRef.current!.style.height = ;
      return;
    }

    const newWidth = info.delta.x / boundariesRect.width * 100;
    controls.set({
      width: `${parseFloat(windowRef.current!.style.width) + newWidth}%`
    });
  }, []);

  const resetResizing = async () => {
    const boundariesRect = getBoundariesRect();
    const lowVerticalSpace = boundariesRect.height < (boundariesRect.width / 16 * 9);

    controls.set({
      width: lowVerticalSpace ? 'auto' : '85%',
      height: lowVerticalSpace ? '85%' : 'auto'
    });

    controls.set({
      x: (boundariesRect.width - windowRef.current!.getBoundingClientRect().width) / 2,
      y: (boundariesRect.height - windowRef.current!.getBoundingClientRect().height) / 2
    });

    setResized(false);
  };

  useEffect(() => {
    if (resized) return;

    const boundariesRect = getBoundariesRect();

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
  }, [resized]);

  useEffect(() => {
    if (isResizing && !resized) { setResized(true); }
  }, [isResizing]);

  useEffect(() => { controls.start({ zIndex }); }, [zIndex]);

  useEffect(() => {
    const input = inputRef.current;

    const inputListener: Parameters<NonNullable<(typeof input)>['addEventListener']>[1] = (e) => {
      setInputValue((e.currentTarget as HTMLDivElement | null)?.textContent || '');
    };
    if (input) {
      input.textContent = media.url;
      input.addEventListener('input', inputListener);
    }

    const observer = new ResizeObserver(([entry]) => {
      windowRef.current!.style.setProperty('--width', `${entry.contentRect.width}`);
      windowRef.current!.style.setProperty('--height', `${entry.contentRect.height}`);
    });
    observer.observe(windowRef.current!);
    return () => {
      observer.disconnect();
      input?.removeEventListener('input', inputListener);
    };
  }, [isEditing]);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <motion.div
          drag
          dragConstraints={boundaries}
          dragElastic={0.5}
          className="absolute cursor-grab max-w-dvw max-h-dvh bg-neutral-700 aspect-video rounded-[1.9rem] shadow-lg"
          whileDrag={{ cursor: 'grabbing' }}
          initial={{ opacity: 0 }}
          animate={controls}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: .3 }}
          onMouseDown={() => mediaStore.placeMediaOnTop(media.id)}
          ref={windowRef}
        >
          <AnimatePresence>
            {isEditing && (
              <>
                <motion.div
                  className="absolute inset-0 w-full h-full bg-black bg-opacity-80 rounded-[inherit] z-10 flex flex-col items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div
                    contentEditable
                    aria-placeholder="Enter URL"
                    ref={inputRef}
                    className={cn(
                      "relative w-full cursor-text outline-none border-none bg-transparent text-white text-center font-extrabold px-[6%]",

                      "empty:[&:not(:focus-visible)]:after:content-['Enter_URL'] empty:[&:not(:focus-visible)]:after:absolute",
                      "empty:[&:not(:focus-visible)]:after:flex                  empty:[&:not(:focus-visible)]:after:opacity-20",
                      "empty:[&:not(:focus-visible)]:after:items-center          empty:[&:not(:focus-visible)]:after:justify-center",
                      "empty:[&:not(:focus-visible)]:after:w-full                empty:[&:not(:focus-visible)]:after:pointer-events-none",
                      "empty:[&:not(:focus-visible)]:after:mx-[-6%]              empty:[&:not(:focus-visible)]:after:text-[inherit]",
                    )}
                    style={{
                      // @ts-expect-error asd
                      '--calc': `calc(12px * (var(--width) / 8) / ${inputValue.length})`,
                      fontSize: `clamp(10px, var(--calc), 42px)`,
                      // ['font-size']: 'var(--calc)'
                    }}
                    onBlur={() => mediaStore.updateMedia(media.id, inputValue)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.currentTarget.blur();
                        mediaStore.updateMedia(media.id, inputValue);
                      }
                    }}
                  />
                </motion.div>
                <motion.svg
                  drag
                  dragElastic={0}
                  dragMomentum={false}
                  onDragStart={() => setIsResizing(true)}
                  onDragEnd={() => setIsResizing(false)}
                  onDrag={handleResize}

                  // initial={{ rotate: '-90deg' }}
                  className="bottom-0 right-0 absolute aspect-square w-[clamp(1.9rem,5%,3rem)] cursor-nwse-resize z-20"
                  style={{ transform: 'rotate(-90deg) translateX(-13%) translateY(13%)' }}
                  transformTemplate={() => `rotate(-90deg) translateX(-13%) translateY(13%)`}

                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}

                  viewBox="0 0 91 91"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 13V23C13 53.3757 37.6244 78 68 78H78"
                    stroke="#A3A3A3"
                    strokeWidth="25"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </>
            )}
          </AnimatePresence>

          {src && (
            <iframe
              src={src}
              className={cn(
                "absolute inset-0 w-full h-full aspect-video rounded-[inherit]",
                { 'pointer-events-none': isEditing },
                { 'cursor-grabbing': isResizing }
              )}
            />
          )}
        </motion.div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset onClick={snapToCenter}>
          Snap to Center
        </ContextMenuItem>
        {resized && (
          <ContextMenuItem inset onClick={resetResizing}>
            Reset Size
          </ContextMenuItem>
        )}
        <ContextMenuItem inset onClick={() => mediaStore.removeMedia(media.id)} className="text-red-400 focus:text-red-400 focus:bg-red-900">
          Remove
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}