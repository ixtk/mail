import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateToFormat) => {
  return new Date(dateToFormat).toLocaleDateString("en-US", {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    weekday: "short",
    day: "2-digit",
    month: "short"
  })
}
