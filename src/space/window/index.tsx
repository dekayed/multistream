
import { AnimatePresence, motion } from "framer-motion";
import { RefObject, useEffect, useRef, useState } from "react";


import { useWindows, type Window as WindowType } from "useWindows";
import { cn } from "utils";

import { ContextMenu } from "./ctx-menu";
import s from "./index.module.css";
import { useMover } from "./useMover";
import { useSrc } from "./useSrc";


type Props = {
  boundaries: RefObject<HTMLDivElement>;
  zIndex?: number;
  editing?: boolean;
} & WindowType;

export function Window(props: Props) {
  const { id, url, boundaries, zIndex = 0, editing } = props;

  const [inputValue, setInputValue] = useState(url);

  const windows = useWindows();

  const windowRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const mover = useMover({ boundaries, zIndex, ref: windowRef });
  const { src } = useSrc({ url });

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
    if (editing) { inputRef.current.textContent = inputValue; }
  }, [editing]);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  }, []);

  return (
    <ContextMenu
      showResetResize={mover.resized}
      onSnapToCenter={mover.snapToCenter}
      onResetResize={mover.resetResize}
      onRemove={() => windows.remove(id)}
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
        transition={{ duration: .3 }}
        onMouseDown={() => windows.putOnTop(id)}
        ref={windowRef}
      >
        <AnimatePresence>
          {editing && (
            <>
              <motion.div
                className="absolute inset-0 w-full h-full bg-black bg-opacity-80 rounded-[inherit] z-10 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span
                  role="textbox"
                  contentEditable
                  aria-placeholder="Enter URL"
                  ref={inputRef}
                  className={cn(
                    s.input,
                    "relative w-full whitespace-pre-wrap cursor-text outline-none border-none bg-transparent text-white text-center font-extrabold px-[6%]"
                  )}
                  style={{
                    // @ts-expect-error css var
                    '--calc': `calc(12px * (var(--width) / 8) / ${inputValue.length})`,
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
                onDragStart={mover.onDragStart}
                onDragEnd={mover.onDragEnd}
                onDrag={mover.onDrag}

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
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            className={cn(
              "absolute inset-0 w-full h-full aspect-video rounded-[inherit]",
              { 'pointer-events-none': editing },
              { 'cursor-grabbing': mover.resizing }
            )}
          />
        )}
      </motion.div>
    </ContextMenu>

  );
}