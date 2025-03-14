import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYoutubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const id = parsed.searchParams.get("v");
    if (id) return id;

    const pathname = parsed.pathname;
    const segments = pathname.split("/");
    return segments[segments.length - 1] || null;
  } catch {
    return null;
  }
}
