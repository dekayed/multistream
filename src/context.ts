import { createContext } from "react";
import type { useMediaStore } from "useMediaStore";

export const Context = createContext<ReturnType<typeof useMediaStore> | null>(null);