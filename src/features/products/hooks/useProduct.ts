import { useCallback } from 'react'
import { useAsync } from '../../../hooks/useAsync.ts'
import { fetchProductById } from '../api.ts'

// Loads one product with all its details; refetches when the id changes
export function useProduct(id: number) {
  const load = useCallback((signal: AbortSignal) => fetchProductById(id, signal), [id])
  return useAsync(load)
}
