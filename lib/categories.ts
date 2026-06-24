// lib/categories.ts — maps a Space's generic `category` to its front-end label.
// Gaming face, generic bones: code stays generic ("games"), UI shows "Game".

const CATEGORY_LABELS: Record<string, string> = {
  games: "Game",
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? "Space";
}
