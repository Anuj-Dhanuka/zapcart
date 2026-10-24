import { useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router'
import type { ProductFilters } from '../types.ts'

// Reads a price from the URL; anything that isn't a non-negative number means "no limit"
function parsePrice(value: string | null): number | null {
  if (value === null || value.trim() === '') return null
  const price = Number(value)
  return Number.isFinite(price) && price >= 0 ? price : null
}

// Reads the page from the URL; anything that isn't a whole number of at least 1 means page 1
function parsePage(value: string | null): number {
  const page = Number(value)
  return Number.isInteger(page) && page >= 1 ? page : 1
}

// Turns the URL's search params into typed filters and a page number
export function parseFilterParams(params: URLSearchParams): { filters: ProductFilters; page: number } {
  return {
    filters: {
      categories: params.getAll('category').filter(Boolean),
      search: params.get('q')?.trim() || null,
      brands: params.getAll('brand').filter(Boolean),
      minPrice: parsePrice(params.get('min')),
      maxPrice: parsePrice(params.get('max')),
    },
    page: parsePage(params.get('page')),
  }
}

// Turns filters and a page back into search params, leaving out defaults so URLs stay short
export function toFilterParams(filters: ProductFilters, page: number): URLSearchParams {
  const params = new URLSearchParams()
  for (const category of filters.categories) params.append('category', category)
  if (filters.search) params.set('q', filters.search)
  for (const brand of filters.brands) params.append('brand', brand)
  if (filters.minPrice !== null) params.set('min', String(filters.minPrice))
  if (filters.maxPrice !== null) params.set('max', String(filters.maxPrice))
  if (page > 1) params.set('page', String(page))
  return params
}

// Keeps the listing's filters and page in the URL so Back, refresh and shared links restore the same view
export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { filters, page } = useMemo(() => parseFilterParams(searchParams), [searchParams])
  const pending = useRef<URLSearchParams | null>(null)

  useEffect(() => {
    pending.current = null
  }, [searchParams])

  // Builds each change on the URL most recently asked for, so two quick changes (e.g. a price blur then a category tick) don't overwrite each other
  const update = (change: (current: ProductFilters) => { filters: ProductFilters; page: number }) => {
    const current = parseFilterParams(pending.current ?? searchParams)
    const next = change(current.filters)
    const params = toFilterParams(next.filters, next.page)
    pending.current = params
    setSearchParams(params, { replace: true, preventScrollReset: true })
  }

  return {
    filters,
    page,
    setCategories: (categories: string[]) => update((f) => ({ filters: { ...f, categories }, page: 1 })),
    setBrands: (brands: string[]) => update((f) => ({ filters: { ...f, brands }, page: 1 })),
    setPriceRange: (minPrice: number | null, maxPrice: number | null) =>
      update((f) => ({ filters: { ...f, minPrice, maxPrice }, page: 1 })),
    setPage: (nextPage: number) => update((f) => ({ filters: f, page: nextPage })),
    clearFilters: () =>
      update((f) => ({ filters: { categories: [], search: f.search, brands: [], minPrice: null, maxPrice: null }, page: 1 })),
  }
}
