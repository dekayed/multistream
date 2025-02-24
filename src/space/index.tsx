import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useRef } from 'react';

import { useWindows } from 'stores/useWindows';

import { ContextMenu } from './ctx-menu';
import { Empty } from './empty';
import { useTheme } from './useTheme';
import { Window } from './window';

export function Space() {
  const windows = useWindows();

  const boundariesRef = useRef<HTMLDivElement>(null);

  useTheme();

  // elements are recreated when moving around the dom (iframes are reloaded)
  // so the order of windows in dom needs to be persistent (sorting by id here)
  const persistentStack = useMemo(() => windows.stack.map((w, i) => ({ ...w, zIndex: i })).toSorted((a, b) => a.id < b.id ? -1 : 1), [windows.stack]);

  return (
    <motion.div
      ref={boundariesRef}
      className="w-full h-full relative flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ContextMenu
        onAdd={(url) => {
          windows.create({ url });
          if (!url) { windows.enableEditing(); }
        }}
        isEditing={windows.editing}
        toggleEditing={windows.toggleEditing}
      />
      <AnimatePresence>
        {persistentStack.length ? persistentStack.map((window) => (
          <Window
            key={window.id}
            boundaries={boundariesRef}
            editing={windows.editing}
            {...window}
          />
        )) : <Empty />}
      </AnimatePresence>
    </motion.div>
  );
}