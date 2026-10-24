import { useCallback } from 'react'
import { useAsync } from '../../../hooks/useAsync.ts'
import { fetchProducts, getCachedProducts } from '../api.ts'

// Loads the products for the given categories ([] = all); refetches only when the set of categories actually changes, showing any cached list meanwhile
export function useProducts(categories: string[]) {
  const key = categories.join(',')
  const load = useCallback((signal: AbortSignal) => fetchProducts(key === '' ? [] : key.split(','), signal), [key])
  return useAsync(load, getCachedProducts(categories))
}
