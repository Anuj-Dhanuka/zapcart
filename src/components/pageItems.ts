export type PageItem = number | 'gap'

const SLOTS = 7

// Picks the page numbers to show: all of them if they fit in 7 slots, otherwise the first and last pages plus the current page's neighbours with gaps, always 7 slots so the bar never changes width
export function getPageItems(current: number, total: number): PageItem[] {
  if (total <= SLOTS) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, 'gap', total]
  if (current >= total - 3) return [1, 'gap', total - 4, total - 3, total - 2, total - 1, total]
  return [1, 'gap', current - 1, current, current + 1, 'gap', total]
}
