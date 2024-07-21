import type { PanInfo } from 'framer-motion';
import { useAnimationControls } from 'framer-motion';
import type { RefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Window } from 'stores/useWindows';
import { useWindows } from 'stores/useWindows';
import { removeEmpty } from 'utils';

type Props = {
  id: Window['id'];
  boundaries: RefObject<HTMLDivElement>;
  zIndex?: number;
  ref: RefObject<HTMLDivElement>;
};

export function useMover(props: Props) {
  const { id, boundaries, zIndex = 0, ref } = props;

  const [resized, setResized] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);

  const aspectRatio = useRef(1);

  const windows = useWindows();

  const controls = useAnimationControls();

  const getBoundariesRect = () => (boundaries.current?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight });

  const onDragEnd = () => {
    const boundariesRect = getBoundariesRect();
    const rect = ref.current!.getBoundingClientRect();

    const x = (rect.x / boundariesRect.width * 100) || 0;
    const y = (rect.y / boundariesRect.height * 100) || 0;

    windows.update(id, removeEmpty({ x, y }));
  };

  const snapToCenter = () => {
    const boundariesRect = getBoundariesRect();

    controls.start({
      x: (boundariesRect.width - ref.current!.getBoundingClientRect().width) / 2,
      y: (boundariesRect.height - ref.current!.getBoundingClientRect().height) / 2,
      transition: { type: 'spring', bounce: 0 },
    });
  };

  const onResize = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const boundariesRect = getBoundariesRect();
    const getRect = () => ref.current!.getBoundingClientRect();

    const changeWidth = () => {
      const newWidth = info.delta.x / boundariesRect.width * 100;
      controls.set({
        width: `${(getRect().width / boundariesRect.width * 100) + newWidth}%`
      });
    };

    const changeHeight = () => {
      const newHeight = info.delta.y / boundariesRect.height * 100;
      if (aspectRatioLocked) {
        if (ref.current!.style.width === 'auto') {
          return controls.set({
            height: `${parseFloat(ref.current!.style.height) + newHeight}%`
          });
        }
        const rect = getRect();
        return controls.set({
          height: `${rect.width / aspectRatio.current / boundariesRect.height * 100}%`
        });
      }
      controls.set({
        height: `${(getRect().height / boundariesRect.height * 100) + newHeight}%`
      });
    };

    if (aspectRatioLocked) {
      const width = ref.current!.style.width;
      const height = ref.current!.style.height;

      const shouldChangeBoth = width && height && width !== 'auto' && height !== 'auto';
      if (shouldChangeBoth) { changeWidth(); changeHeight(); return; }
      const shouldChangeHeight = width === 'auto';
      if (shouldChangeHeight) { return changeHeight(); }
      return changeWidth();
    }

    changeWidth();
    changeHeight();
  }, [aspectRatioLocked]);

  const onResizeEnd = () => {
    setResizing(false);

    const rect = ref.current!.getBoundingClientRect();
    aspectRatio.current = rect.width / rect.height;

    const width = parseFloat(ref.current!.style.width) || undefined;
    const height = parseFloat(ref.current!.style.height) || undefined;

    windows.update(id, removeEmpty({ width, height }));
  };

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

    setAspectRatioLocked(true);
    setResized(false);
  };

  useEffect(() => {
    if (resized) return;

    const boundariesRect = getBoundariesRect();
    const window = windows.stack.find((w) => w.id === id);

    const setDimensions = (boundaries: { width: number, height: number }) => {
      const bothDefined = window?.width && window?.height;
      const lowVerticalSpace = boundaries.height < (boundaries.width / 16 * 9);
      ref.current!.style.width = bothDefined ? (window.width + '%') : (lowVerticalSpace ? 'auto' : `${window?.width || 85}%`);
      ref.current!.style.height = bothDefined ? (window.height + '%') : (lowVerticalSpace ? `${window?.height || 85}%` : 'auto');
    };

    const observer = new ResizeObserver(([entry]) => setDimensions(entry.contentRect));

    setDimensions(boundariesRect);

    observer.observe(boundaries.current!);

    controls.set({
      x: ((window?.x || 0) / 100 * boundariesRect.width) || ((boundariesRect.width - ref.current!.getBoundingClientRect().width) / 2),
      y: ((window?.y || 0) / 100 * boundariesRect.height) || ((boundariesRect.height - ref.current!.getBoundingClientRect().height) / 2)
    });

    controls.start({
      opacity: 1,
    });

    return () => observer.disconnect();
  }, [resized]);

  useEffect(() => { if (resizing && !resized) { setResized(true); } }, [resizing, resized]);
  useEffect(() => { controls.start({ zIndex }); }, [controls, zIndex]);
  useEffect(() => {
    const rect = ref.current!.getBoundingClientRect();
    aspectRatio.current = rect.width / rect.height;
  }, []);

  return {
    controls,
    onResizeStart: () => setResizing(true),
    onResize,
    onResizeEnd,
    onDragEnd,
    resized,
    resizing,
    resetResize,
    snapToCenter,
    aspectRatioLocked,
    toggleLockAspectRatio: () => setAspectRatioLocked((locked) => !locked),
  };
}