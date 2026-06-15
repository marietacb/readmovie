import type { Book, WishlistItem } from "@/types";

export function isWishlistItemRead(item: WishlistItem, book?: Book): boolean {
  if (item.read) return true;
  if (book?.endDate) return true;
  return false;
}

export function splitWishlistColumns<T>(items: T[]): [T[], T[]] {
  const mid = Math.ceil(items.length / 2);
  return [items.slice(0, mid), items.slice(mid)];
}
