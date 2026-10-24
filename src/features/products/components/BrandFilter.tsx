import { FilterCheckboxList } from './FilterCheckboxList.tsx'
import { FilterGroup } from './FilterGroup.tsx'
import styles from './FilterGroup.module.css'

type BrandFilterProps = {
  brands: string[] | null
  selected: string[]
  onChange: (brands: string[]) => void
}

// Multi-select brand checkboxes built from the loaded products (null = still loading)
export function BrandFilter({ brands, selected, onChange }: BrandFilterProps) {
  return (
    <FilterGroup legend="Brand" clearLabel="Clear brand filter" canClear={selected.length > 0} onClear={() => onChange([])}>
      {brands === null && (
        <p className={styles.note} role="status">
          Loading brands…
        </p>
      )}
      {brands !== null && brands.length === 0 && selected.length === 0 && (
        <p className={styles.note}>No brands in this category.</p>
      )}
      {brands !== null && (
        <FilterCheckboxList
          name="brand"
          options={brands.map((brand) => ({ value: brand, label: brand }))}
          selected={selected}
          onChange={onChange}
        />
      )}
    </FilterGroup>
  )
}
