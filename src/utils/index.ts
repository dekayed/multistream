import classnames from "classnames";
import { twMerge } from "tailwind-merge";

export function cn(...args: Parameters<typeof classnames>) {
  return twMerge(classnames(args));
}

export function removeEmpty(obj: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null));
}