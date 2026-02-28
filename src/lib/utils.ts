import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeHostOrDomain(value: string) {
  return value
    .trim()
    .toLowerCase()
    .split(",")[0]
    .trim()
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .replace(/\.$/, "")
    .replace(/:\d+$/, "");
}
