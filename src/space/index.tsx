import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { getHost } from 'parsers';
import { useWindows } from 'useWindows';

import { ContextMenu } from './ctx-menu';
import { Empty } from './empty';
import { Window } from './window';

export function Space() {
  const windows = useWindows();

  const boundariesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (windows.stack.every((w) => getHost(w.url) === 'twitch' || getHost(w.url) === 'twitch-chat')) {
      document.body.classList.add('twitch');
      return;
    }
    document.body.classList.remove('twitch');
  }, [windows.stack]);

  return (
    <motion.div
      ref={boundariesRef}
      className="w-full h-full relative flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ContextMenu
        onAdd={(url) => windows.create({ url })}
        isEditing={windows.editing}
        toggleEditing={windows.toggleEditing}
      />
      <AnimatePresence>
        {windows.stack.length ? windows.stack.map((window) => (
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