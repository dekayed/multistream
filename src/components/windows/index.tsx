import { Context } from "context";
import { useContext, useRef } from "react";
import { motion } from "framer-motion";

import { Window } from "./window";
import { Background } from "components/background";
import { AnimatePresence } from "framer-motion";

export function Windows() {
  const mediaStore = useContext(Context)!;

  const boundariesRef = useRef<HTMLDivElement>(null);

  if (mediaStore.mediaList.size === 0) return null;

  // const videoPlaying = Array.from(mediaStore.mediaList).some((media) => getIframeSrc(media) !== null);

  return (
    <motion.div
      ref={boundariesRef}
      className="w-full h-full relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Background
        onAdd={mediaStore.addNewMedia}
        isEditing={mediaStore.isEditing}
        toggleEditing={() => mediaStore.setIsEditing((isEditing) => !isEditing)}
      />
      <AnimatePresence>
        {Array.from(mediaStore.mediaList).map((media) => (
          <Window
            key={media.id}
            boundaries={boundariesRef}
            media={media}
            isEditing={mediaStore.isEditing}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}