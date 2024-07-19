import { motion } from "framer-motion";

export function Empty() {
  return (
    <motion.div
      className="w-full h-full p-24 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full h-full dashes rounded-[1.9rem] aspect-video flex flex-col gap-7 items-center justify-center text-neutral-400">
        <h1 className="font-extrabold text-6xl">No streams added</h1>
        <h5 className="font-medium text-xl">Right click on the background to reveal a menu</h5>
      </div>
    </motion.div>
  );
}