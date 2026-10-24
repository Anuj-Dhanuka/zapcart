import { describe, expect, it } from 'vitest'
import type { ProductFilters } from '../types.ts'
import { parseFilterParams, toFilterParams } from './useProductFilters.ts'

const parse = (query: string) => parseFilterParams(new URLSearchParams(query))

const noFilters: ProductFilters = { categories: [], search: null, brands: [], minPrice: null, maxPrice: null }

describe('parseFilterParams', () => {
  it('reads every filter and the page from a full URL', () => {
    expect(parse('category=laptops&category=smartphones&q=pro&brand=Apple&brand=Samsung&min=500&max=2000&page=2')).toEqual({
      filters: { categories: ['laptops', 'smartphones'], search: 'pro', brands: ['Apple', 'Samsung'], minPrice: 500, maxPrice: 2000 },
      page: 2,
    })
  })

  it('treats an empty URL as no filters on page 1', () => {
    expect(parse('')).toEqual({ filters: noFilters, page: 1 })
  })

  it('ignores values that are not valid numbers or pages', () => {
    expect(parse('min=banana&max=-5&page=abc')).toEqual({ filters: noFilters, page: 1 })
    expect(parse('page=2.5').page).toBe(1)
    expect(parse('page=0').page).toBe(1)
  })

  it('does not turn an empty or blank price into 0', () => {
    expect(parse('min=&max=%20').filters).toEqual(noFilters)
  })

  it('keeps 0 as a real price limit', () => {
    expect(parse('min=0').filters.minPrice).toBe(0)
  })

  it('ignores empty category and brand values', () => {
    expect(parse('category=&brand=').filters).toEqual(noFilters)
  })

  it('trims the search and treats a blank one as no search', () => {
    expect(parse('q=%20%20phone%20').filters.search).toBe('phone')
    expect(parse('q=%20%20').filters.search).toBeNull()
  })
})

describe('toFilterParams', () => {
  it('leaves out defaults so an unfiltered first page is an empty query', () => {
    expect(toFilterParams(noFilters, 1).toString()).toBe('')
  })

  it('repeats the category key for several categories', () => {
    expect(toFilterParams({ ...noFilters, categories: ['laptops', 'smartphones'] }, 1).toString()).toBe('category=laptops&category=smartphones')
  })

  it('repeats the brand key for several brands', () => {
    expect(toFilterParams({ ...noFilters, brands: ['Apple', 'Samsung'] }, 1).toString()).toBe('brand=Apple&brand=Samsung')
  })

  it('round-trips filters and page through the URL without losing anything', () => {
    const filters: ProductFilters = { categories: ['mens-shoes', 'tops'], search: 'running shoe', brands: ['Nike', 'Puma Sport'], minPrice: 0, maxPrice: 99.5 }
    expect(parseFilterParams(toFilterParams(filters, 4))).toEqual({ filters, page: 4 })
  })
})
