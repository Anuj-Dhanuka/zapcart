import type { Review } from './types.ts'

// Orders reviews highest rating first, newest first among equal ratings, without changing the original list
export function sortReviewsBestFirst(reviews: Review[]): Review[] {
  return [...reviews].sort((a, b) => b.rating - a.rating || Date.parse(b.date) - Date.parse(a.date))
}
