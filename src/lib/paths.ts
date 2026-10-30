// Explained paths (DESIGN §4): pieces that share a `series` form an ordered path; each piece
// links to the one before and after it. Pure, so it is unit-tested without Astro.

export interface PathItem {
  id: string;
  data: { series?: string | undefined; order?: number | undefined };
}

export function pathNeighbours<T extends PathItem>(
  all: readonly T[],
  current: T,
): { prev?: T; next?: T; index: number; total: number } {
  const series = current.data.series;
  if (!series) return { index: 0, total: 0 };
  const path = all
    .filter((p) => p.data.series === series)
    .sort(
      (a, b) => (a.data.order ?? Infinity) - (b.data.order ?? Infinity) || a.id.localeCompare(b.id),
    );
  const i = path.findIndex((p) => p.id === current.id);
  const prev = i > 0 ? path[i - 1] : undefined;
  const next = i >= 0 && i < path.length - 1 ? path[i + 1] : undefined;
  return { ...(prev ? { prev } : {}), ...(next ? { next } : {}), index: i + 1, total: path.length };
}
