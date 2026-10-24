import { getJson } from '../../lib/http.ts'
import type { Category, Product, ProductListResponse, ProductSummary } from './types.ts'

const LIST_FIELDS = 'title,price,rating,thumbnail,brand,category'

// Fetches one product list endpoint with every item and only the fields the listing page needs
async function fetchList(path: string, signal?: AbortSignal): Promise<ProductSummary[]> {
  const data = await getJson<ProductListResponse>(`${path}?limit=0&select=${LIST_FIELDS}`, signal)
  return data.products
}

const productListCache = new Map<string, ProductSummary[]>()

// The last product list loaded for these categories in this session, if any (lets Back render instantly)
export function getCachedProducts(categories: string[]): ProductSummary[] | undefined {
  return productListCache.get(categories.join(','))
}

// Fetches every product, or the products of the given categories (one request each, in parallel, merged in order), and remembers the result
export async function fetchProducts(categories: string[], signal?: AbortSignal): Promise<ProductSummary[]> {
  const products =
    categories.length === 0
      ? await fetchList('/products', signal)
      : (
          await Promise.all(
            categories.map((category) => fetchList(`/products/category/${encodeURIComponent(category)}`, signal)),
          )
        ).flat()
  productListCache.set(categories.join(','), products)
  return products
}

// Fetches all categories for the filter sidebar
export function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  return getJson<Category[]>('/products/categories', signal)
}

// Fetches one product with all its details for the detail page
export function fetchProductById(id: number, signal?: AbortSignal): Promise<Product> {
  return getJson<Product>(`/products/${id}`, signal)
}
