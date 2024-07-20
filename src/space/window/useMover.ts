import { PanInfo, useAnimationControls } from "framer-motion";
import { RefObject, useCallback, useEffect, useState } from "react";

type Props = {
  boundaries: RefObject<HTMLDivElement>;
  zIndex?: number;
  ref: RefObject<HTMLDivElement>;
};

export function useMover(props: Props) {
  const { boundaries, zIndex = 0, ref } = props;

  const [resized, setResized] = useState(false);
  const [resizing, setResizing] = useState(false);

  const controls = useAnimationControls();

  const getBoundariesRect = () => boundaries.current?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };

  const snapToCenter = () => {
    const boundariesRect = getBoundariesRect();

    controls.start({
      x: (boundariesRect.width - ref.current!.getBoundingClientRect().width) / 2,
      y: (boundariesRect.height - ref.current!.getBoundingClientRect().height) / 2,
      transition: { type: 'spring', bounce: 0 },
    });
  };

  const onDrag = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const shouldChangeHeight = ref.current!.style.width === 'auto';
    const boundariesRect = getBoundariesRect();

    if (shouldChangeHeight) {
      const newHeight = info.delta.y / boundariesRect.height * 100;
      controls.set({
        height: `${parseFloat(ref.current!.style.height) + newHeight}%`
      });
      return;
    }

    const newWidth = info.delta.x / boundariesRect.width * 100;
    controls.set({
      width: `${parseFloat(ref.current!.style.width) + newWidth}%`
    });
  }, []);

  const resetResize = async () => {
    const boundariesRect = getBoundariesRect();
    const lowVerticalSpace = boundariesRect.height < (boundariesRect.width / 16 * 9);

    controls.set({
      width: lowVerticalSpace ? 'auto' : '85%',
      height: lowVerticalSpace ? '85%' : 'auto'
    });

    controls.set({
      x: (boundariesRect.width - ref.current!.getBoundingClientRect().width) / 2,
      y: (boundariesRect.height - ref.current!.getBoundingClientRect().height) / 2
    });

    setResized(false);
  };

  useEffect(() => {
    if (resized) return;

    const boundariesRect = getBoundariesRect();

    const observer = new ResizeObserver(([entry]) => {
      const lowVerticalSpace = entry.contentRect.height < (entry.contentRect.width / 16 * 9);

      ref.current!.style.width = lowVerticalSpace ? 'auto' : '85%';
      ref.current!.style.height = lowVerticalSpace ? '85%' : 'auto';
    });

    const lowVerticalSpace = boundariesRect.height < (boundariesRect.width / 16 * 9);
    ref.current!.style.width = lowVerticalSpace ? 'auto' : '85%';
    ref.current!.style.height = lowVerticalSpace ? '85%' : 'auto';

    observer.observe(boundaries.current!);

    controls.set({
      x: (boundariesRect.width - ref.current!.getBoundingClientRect().width) / 2,
      y: (boundariesRect.height - ref.current!.getBoundingClientRect().height) / 2
    });

    controls.start({
      opacity: 1,
    });

    return () => observer.disconnect();
  }, [resized]);

  useEffect(() => { if (resizing && !resized) { setResized(true); } }, [resizing, resized]);
  useEffect(() => { controls.start({ zIndex }); }, [controls, zIndex]);

  return {
    controls,
    onDragStart: () => setResizing(true),
    onDragEnd: () => setResizing(false),
    onDrag,
    resized,
    resizing,
    resetResize,
    snapToCenter,
  };
}