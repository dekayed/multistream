import classnames from "classnames";
import { twMerge } from "tailwind-merge";

export function cn(...args: Parameters<typeof classnames>) {
  return twMerge(classnames(args));
} 