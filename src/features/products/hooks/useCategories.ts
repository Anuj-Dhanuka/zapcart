import { useAsync } from '../../../hooks/useAsync.ts'
import { fetchCategories } from '../api.ts'

// Loads the category list for the filter sidebar
export function useCategories() {
  return useAsync(fetchCategories)
}
