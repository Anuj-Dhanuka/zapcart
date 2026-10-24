import { describe, expect, it } from 'vitest'
import { applyFilters, getBrands, paginate } from './filters.ts'
import type { ProductFilters, ProductSummary } from './types.ts'

// Builds a small fake product; only the fields a test cares about need to be given
function product(id: number, price: number, brand?: string): ProductSummary {
  return { id, title: `Product ${id}`, price, rating: 4, thumbnail: '', category: 'test', brand }
}

const products = [
  product(1, 10, 'Apple'),
  product(2, 15, 'Samsung'),
  product(3, 20, 'Apple'),
  product(4, 25),
  product(5, 30, 'Xiaomi'),
]

const noFilters: ProductFilters = { categories: [], search: null, brands: [], minPrice: null, maxPrice: null }

const ids = (list: ProductSummary[]) => list.map((p) => p.id)

describe('applyFilters', () => {
  it('returns every product when no filters are set', () => {
    expect(ids(applyFilters(products, noFilters))).toEqual([1, 2, 3, 4, 5])
  })

  it('keeps products at or above the minimum price', () => {
    expect(ids(applyFilters(products, { ...noFilters, minPrice: 20 }))).toEqual([3, 4, 5])
  })

  it('keeps products at or below the maximum price', () => {
    expect(ids(applyFilters(products, { ...noFilters, maxPrice: 15 }))).toEqual([1, 2])
  })

  it('includes products exactly on both price bounds', () => {
    expect(ids(applyFilters(products, { ...noFilters, minPrice: 10, maxPrice: 20 }))).toEqual([1, 2, 3])
  })

  it('keeps only the selected brand', () => {
    expect(ids(applyFilters(products, { ...noFilters, brands: ['Apple'] }))).toEqual([1, 3])
  })

  it('treats several selected brands as "any of these"', () => {
    expect(ids(applyFilters(products, { ...noFilters, brands: ['Apple', 'Xiaomi'] }))).toEqual([1, 3, 5])
  })

  it('excludes products without a brand once a brand is selected', () => {
    expect(ids(applyFilters(products, { ...noFilters, brands: ['Apple', 'Samsung', 'Xiaomi'] }))).not.toContain(4)
  })

  it('requires every filter to match when price and brand are combined', () => {
    expect(ids(applyFilters(products, { ...noFilters, brands: ['Apple'], minPrice: 15 }))).toEqual([3])
  })

  it('returns nothing when the minimum is above the maximum', () => {
    expect(applyFilters(products, { ...noFilters, minPrice: 30, maxPrice: 10 })).toEqual([])
  })

  it('does not change the original list', () => {
    const before = ids(products)
    applyFilters(products, { ...noFilters, minPrice: 100 })
    expect(ids(products)).toEqual(before)
  })
})

describe('applyFilters search', () => {
  const phones = [
    { ...product(1, 500, 'Apple'), title: 'iPhone 13 Pro' },
    { ...product(2, 300, 'Samsung'), title: 'Galaxy S8' },
    { ...product(3, 900), title: 'Phone Stand Pro' },
  ]

  it('matches the title, ignoring capital letters', () => {
    expect(ids(applyFilters(phones, { ...noFilters, search: 'PHONE' }))).toEqual([1, 3])
  })

  it('matches the brand as well as the title', () => {
    expect(ids(applyFilters(phones, { ...noFilters, search: 'samsung' }))).toEqual([2])
  })

  it('combines with the other filters', () => {
    expect(ids(applyFilters(phones, { ...noFilters, search: 'pro', maxPrice: 600 }))).toEqual([1])
  })

  it('returns nothing when no product matches', () => {
    expect(applyFilters(phones, { ...noFilters, search: 'laptop' })).toEqual([])
  })
})

describe('getBrands', () => {
  it('lists each brand once', () => {
    expect(getBrands(products)).toEqual(['Apple', 'Samsung', 'Xiaomi'])
  })

  it('sorts alphabetically regardless of capital letters', () => {
    expect(getBrands([product(1, 1, 'zara'), product(2, 1, 'Apple'), product(3, 1, 'Nike')])).toEqual(['Apple', 'Nike', 'zara'])
  })

  it('skips products without a brand', () => {
    expect(getBrands([product(1, 1), product(2, 1, 'Apple')])).toEqual(['Apple'])
  })

  it('returns an empty list for no products', () => {
    expect(getBrands([])).toEqual([])
  })
})

describe('paginate', () => {
  const letters = ['a', 'b', 'c', 'd', 'e']

  it('returns the first page', () => {
    expect(paginate(letters, 1, 2)).toEqual({ items: ['a', 'b'], page: 1, totalPages: 3 })
  })

  it('returns a partial last page', () => {
    expect(paginate(letters, 3, 2)).toEqual({ items: ['e'], page: 3, totalPages: 3 })
  })

  it('clamps a page number that is too high to the last page', () => {
    expect(paginate(letters, 999, 2)).toEqual({ items: ['e'], page: 3, totalPages: 3 })
  })

  it('clamps a page number below 1 to the first page', () => {
    expect(paginate(letters, 0, 2).page).toBe(1)
    expect(paginate(letters, -3, 2).page).toBe(1)
  })

  it('treats an empty list as one empty page', () => {
    expect(paginate([], 1, 2)).toEqual({ items: [], page: 1, totalPages: 1 })
  })

  it('uses 12 items per page by default', () => {
    const many = Array.from({ length: 30 }, (_, i) => i)
    expect(paginate(many, 1).items).toHaveLength(12)
    expect(paginate(many, 1).totalPages).toBe(3)
  })
})
