
import { AnimatePresence, motion } from 'framer-motion';
import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';


import { useFavorites } from 'stores/useFavorites';
import { useWindows, type Window as WindowType } from 'stores/useWindows';
import { cn } from 'utils';

import { ContextMenu } from './ctx-menu';
import s from './index.module.css';
import { useMover } from './useMover';
import { useSrc } from './useSrc';


type Props = {
  boundaries: RefObject<HTMLDivElement>;
  zIndex?: number;
  editing?: boolean;
} & WindowType;

export function Window(props: Props) {
  const { id, url, boundaries, zIndex = 0, editing } = props;

  const [inputValue, setInputValue] = useState(url);

  const windows = useWindows();
  const favorites = useFavorites();

  const windowRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const mover = useMover({ id, boundaries, zIndex, ref: windowRef });
  const { src } = useSrc({ url });

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!windowRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      (entry.target as HTMLDivElement).style.setProperty('--width', `${entry.contentRect.width}`);
      (entry.target as HTMLDivElement).style.setProperty('--height', `${entry.contentRect.height}`);
    });
    observer.observe(windowRef.current);
    return () => observer.disconnect();
  }, [editing]);

  useEffect(() => {
    if (!inputRef.current) return;
    if (editing && !isFavorite) { inputRef.current.textContent = inputValue; }
  }, [editing]);

  useEffect(() => {
    if (!iframeRef.current) return;
    iframeRef.current.classList.toggle('pointer-events-none', editing);
    iframeRef.current.classList.toggle('cursor-grabbing', mover.resizing);
  }, [editing, mover.resizing]);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  }, []);

  const isFavorite = favorites.list.some((f) => f.url === url);

  useEffect(() => {
    if (!inputRef.current || !editing) return;
    if (isFavorite) {
      inputRef.current!.textContent = favorites.list.find((f) => f.url === url)?.name || '';
      return;
    }
    inputRef.current.textContent = url;
  }, [isFavorite, url, editing]);

  return (
    <ContextMenu
      isFavorite={isFavorite}
      url={url}
      addFavorite={(name) => favorites.add({ name, url })}
      removeFavorite={() => favorites.remove(url)}
      onSnapToCenter={mover.snapToCenter}
      onRemove={() => windows.remove(id)}
      aspectRatioLocked={mover.aspectRatioLocked}
      onToggleAspectRatioLock={mover.toggleLockAspectRatio}
    >
      <motion.div
        drag
        dragConstraints={boundaries}
        dragElastic={0.5}
        className="absolute top-0 left-0 cursor-grab max-w-dvw max-h-dvh bg-neutral-700 aspect-video rounded-[1.9rem] shadow-lg"
        whileDrag={{ cursor: 'grabbing' }}
        initial={{ opacity: 0 }}
        animate={mover.controls}
        exit={{ opacity: 0, scale: 0.9 }}
        // transformTemplate={mover.transformTemplate}
        transition={{ duration: .3 }}
        onDragEnd={mover.onDragEnd}
        onMouseDown={() => windows.putOnTop(id)}
        ref={windowRef}
      >
        <AnimatePresence>
          {editing && (
            <>
              <motion.div
                className="absolute inset-0 w-full h-full bg-black bg-opacity-80 rounded-[1.8rem] z-10 flex flex-col items-center justify-center ring-neutral-700 ring-inset ring-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span
                  role="textbox"
                  contentEditable={!isFavorite}
                  aria-placeholder="Enter URL"
                  ref={inputRef}
                  className={cn(
                    s.input,
                    'relative w-full whitespace-pre-wrap cursor-text outline-none border-none bg-transparent text-white text-center font-extrabold px-[6%]'
                  )}
                  style={{
                    // @ts-expect-error css var
                    '--calc': `calc(12px * (var(--width) / 8) / ${inputValue?.length || 1})`,
                  }}
                  onBlur={() => windows.update(id, { url: inputValue })}
                  onInput={(e) => {
                    if (e.currentTarget.innerText === '\n') { e.currentTarget.innerText = ''; }
                    setInputValue((e.currentTarget as HTMLDivElement | null)?.textContent || '');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur();
                      windows.update(id, { url: inputValue });
                    }
                  }}
                />
              </motion.div>
              <motion.svg
                drag
                dragElastic={0}
                dragMomentum={false}
                onDragStart={mover.onResizeStart}
                onDragEnd={mover.onResizeEnd}
                onDrag={mover.onResize}

                className="bottom-0 right-0 absolute aspect-square w-[clamp(1.9rem,5%,3rem)] cursor-nwse-resize z-20"
                style={{ transform: 'rotate(-90deg) translateX(-13%) translateY(13%)' }}
                transformTemplate={() => 'rotate(-90deg) translateX(-13%) translateY(13%)'}

                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                whileDrag={{ opacity: 1 }}
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
            ref={iframeRef}
            src={src}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            className="absolute inset-0 w-full h-full aspect-video rounded-[inherit]"
          />
        )}
      </motion.div>
    </ContextMenu>

  );
}