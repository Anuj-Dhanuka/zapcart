import { describe, expect, it } from 'vitest'
import { getPageItems } from './pageItems.ts'

describe('getPageItems', () => {
  it('shows every page when there are 7 or fewer', () => {
    expect(getPageItems(1, 1)).toEqual([1])
    expect(getPageItems(3, 5)).toEqual([1, 2, 3, 4, 5])
    expect(getPageItems(7, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('shows the first five pages and the last near the start', () => {
    expect(getPageItems(1, 17)).toEqual([1, 2, 3, 4, 5, 'gap', 17])
    expect(getPageItems(4, 17)).toEqual([1, 2, 3, 4, 5, 'gap', 17])
  })

  it('shows the neighbours of the current page with gaps on both sides in the middle', () => {
    expect(getPageItems(5, 17)).toEqual([1, 'gap', 4, 5, 6, 'gap', 17])
    expect(getPageItems(9, 17)).toEqual([1, 'gap', 8, 9, 10, 'gap', 17])
  })

  it('shows the first page and the last five near the end', () => {
    expect(getPageItems(14, 17)).toEqual([1, 'gap', 13, 14, 15, 16, 17])
    expect(getPageItems(17, 17)).toEqual([1, 'gap', 13, 14, 15, 16, 17])
  })

  it('handles the smallest total that needs gaps', () => {
    expect(getPageItems(4, 8)).toEqual([1, 2, 3, 4, 5, 'gap', 8])
    expect(getPageItems(5, 8)).toEqual([1, 'gap', 4, 5, 6, 7, 8])
  })

  it('always uses 7 slots and always includes the current, first and last pages', () => {
    for (let total = 8; total <= 30; total++) {
      for (let current = 1; current <= total; current++) {
        const items = getPageItems(current, total)
        expect(items).toHaveLength(7)
        expect(items).toContain(current)
        expect(items[0]).toBe(1)
        expect(items.at(-1)).toBe(total)
      }
    }
  })
})
