// import { Menu, Minus, Plus, X } from "lucide-react";
import { useState } from "react";
// import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
// import { cn } from "utils";
import { useMediaStore } from "./useMediaStore";
import { Background } from "components/background";
import { Empty } from "components/empty";
import { Windows } from "components/windows";
import { Context } from "context";
import { AnimatePresence } from "framer-motion";

function App() {
  const [editing, setEditing] = useState<boolean>(true);

  const mediaStore = useMediaStore();

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <Background
        onAdd={mediaStore.addNewMedia}
        isEditing={mediaStore.isEditing}
        toggleEditing={() => mediaStore.setIsEditing((isEditing) => !isEditing)}
      />
      <Context.Provider value={mediaStore}>
        <AnimatePresence initial>
          {mediaStore.mediaList.size === 0 ? (
            <Empty />
          ) : (
            <Windows />
          )}
        </AnimatePresence>
      </Context.Provider>
    </div>
  );
}

export default App;
