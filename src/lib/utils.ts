import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDefaultAvatar(identifier: string) {
  // Use a simple hash to deterministically pick between emoji-1.jpeg and emoji-7.jpeg
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % 7 + 1;
  return `/profile-pict/emoji-${index}.jpeg`;
}

export function getUserAvatar(user: { id?: string | null, email?: string | null, image?: string | null, name?: string | null } | null | undefined) {
  if (user?.image) return user.image;
  return getDefaultAvatar(user?.name || user?.email || user?.id || "default");
}
