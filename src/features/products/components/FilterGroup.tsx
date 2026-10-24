import { useRef, type ReactNode } from 'react'
import styles from './FilterGroup.module.css'

type FilterGroupProps = {
  legend: string
  clearLabel: string
  canClear: boolean
  onClear: () => void
  children: ReactNode
}

// A titled filter group with a Clear button (shown only while the filter is active) that resets it and moves focus to the group's first control
export function FilterGroup({ legend, clearLabel, canClear, onClear, children }: FilterGroupProps) {
  const group = useRef<HTMLFieldSetElement>(null)

  const handleClear = () => {
    onClear()
    group.current?.querySelector<HTMLElement>('input')?.focus()
  }

  return (
    <fieldset ref={group} className={styles.group}>
      <legend className={styles.legend}>{legend}</legend>
      {canClear && (
        <button type="button" className={styles.clear} onClick={handleClear} aria-label={clearLabel}>
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          Clear
        </button>
      )}
      {children}
    </fieldset>
  )
}
