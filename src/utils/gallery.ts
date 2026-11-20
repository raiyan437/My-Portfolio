export type GalleryItem = "project" | "certificate";

export function formatGalleryCount(count: number, noun: GalleryItem) {
  return count + " " + noun + (count === 1 ? "" : "s") + " shown.";
}
