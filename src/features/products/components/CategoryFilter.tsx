import { useCategories } from '../hooks/useCategories.ts'
import { FilterCheckboxList } from './FilterCheckboxList.tsx'
import { FilterGroup } from './FilterGroup.tsx'
import styles from './FilterGroup.module.css'

type CategoryFilterProps = {
  selected: string[]
  onChange: (categories: string[]) => void
}

// Multi-select category checkboxes loaded from the API; nothing ticked means all categories
export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const categories = useCategories()

  return (
    <FilterGroup
      legend="Category"
      clearLabel="Clear category filter"
      canClear={selected.length > 0}
      onClear={() => onChange([])}
    >
      {categories.status === 'loading' && (
        <p className={styles.note} role="status">
          Loading categories…
        </p>
      )}
      {categories.status === 'error' && (
        <p className={styles.note} role="alert">
          Couldn't load categories.{' '}
          <button type="button" className={styles.retry} onClick={categories.retry}>
            Try again
          </button>
        </p>
      )}
      {categories.status === 'success' && (
        <FilterCheckboxList
          name="category"
          options={categories.data.map((category) => ({ value: category.slug, label: category.name }))}
          selected={selected}
          onChange={onChange}
        />
      )}
    </FilterGroup>
  )
}
