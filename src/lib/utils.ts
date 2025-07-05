import { clsx, type ClassValue } from &ldquo;clsx&rdquo;;
import { twMerge } from &ldquo;tailwind-merge&rdquo;;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
