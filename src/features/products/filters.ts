import type { ProductFilters, ProductSummary } from './types.ts'

export const PAGE_SIZE = 12

// One page of a longer list, plus where it sits
export type Page<T> = {
  items: T[]
  page: number
  totalPages: number
}

// Keeps products whose title or brand contains the search, inside the price range and, if any brands are selected, from one of them; category is already filtered by the API
export function applyFilters(products: ProductSummary[], filters: ProductFilters): ProductSummary[] {
  const { search, brands, minPrice, maxPrice } = filters
  const term = search?.toLowerCase()
  return products.filter(
    (product) =>
      (!term || product.title.toLowerCase().includes(term) || product.brand?.toLowerCase().includes(term)) &&
      (minPrice === null || product.price >= minPrice) &&
      (maxPrice === null || product.price <= maxPrice) &&
      (brands.length === 0 || (product.brand !== undefined && brands.includes(product.brand))),
  )
}

// Lists each brand once, alphabetically, ignoring products without a brand
export function getBrands(products: ProductSummary[]): string[] {
  const brands = new Set<string>()
  for (const product of products) {
    if (product.brand) brands.add(product.brand)
  }
  return [...brands].sort((a, b) => a.localeCompare(b))
}

// Cuts a list into pages and returns one of them, clamping the page number into the valid range
export function paginate<T>(items: T[], page: number, pageSize = PAGE_SIZE): Page<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const current = Math.min(Math.max(page, 1), totalPages)
  const start = (current - 1) * pageSize
  return { items: items.slice(start, start + pageSize), page: current, totalPages }
}
