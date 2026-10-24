import { describe, expect, it } from 'vitest'
import { sortReviewsBestFirst } from './reviews.ts'
import type { Review } from './types.ts'

const review = (reviewerName: string, rating: number, date: string): Review => ({ reviewerName, rating, comment: '', date })

describe('sortReviewsBestFirst', () => {
  it('puts the highest ratings first and keeps every review', () => {
    const sorted = sortReviewsBestFirst([review('A', 2, '2025-01-01'), review('B', 5, '2025-01-01'), review('C', 4, '2025-01-01')])
    expect(sorted.map((r) => r.reviewerName)).toEqual(['B', 'C', 'A'])
  })

  it('shows the newest first when ratings are equal', () => {
    const sorted = sortReviewsBestFirst([review('Old', 5, '2024-03-01T10:00:00Z'), review('New', 5, '2025-06-01T10:00:00Z')])
    expect(sorted.map((r) => r.reviewerName)).toEqual(['New', 'Old'])
  })

  it('does not change the original list', () => {
    const original = [review('A', 1, '2025-01-01'), review('B', 5, '2025-01-01')]
    sortReviewsBestFirst(original)
    expect(original.map((r) => r.reviewerName)).toEqual(['A', 'B'])
  })
})
