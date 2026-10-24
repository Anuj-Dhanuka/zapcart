import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { FilterGroup } from './FilterGroup.tsx'
import styles from './FilterGroup.module.css'

type PriceFilterProps = {
  min: number | null
  max: number | null
  onChange: (min: number | null, max: number | null) => void
}

// Reads a price box: empty means no limit, and anything that isn't a non-negative number is invalid
function readPrice(text: string): number | null | 'invalid' {
  const trimmed = text.trim()
  if (trimmed === '') return null
  const price = Number(trimmed)
  return Number.isFinite(price) && price >= 0 ? price : 'invalid'
}

// Puts the URL's value into a box, unless the box already means the same number
function syncBox(box: HTMLInputElement | null, value: number | null) {
  if (box && readPrice(box.value) !== value) box.value = value === null ? '' : String(value)
}

// Min/max price boxes that apply when the Apply button is clicked (or Enter is pressed)
export function PriceFilter({ min, max, onChange }: PriceFilterProps) {
  const id = useId()
  const minBox = useRef<HTMLInputElement>(null)
  const maxBox = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<'format' | 'order' | null>(null)

  useEffect(() => syncBox(minBox.current, min), [min])
  useEffect(() => syncBox(maxBox.current, max), [max])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextMin = readPrice(minBox.current?.value ?? '')
    const nextMax = readPrice(maxBox.current?.value ?? '')
    if (nextMin === 'invalid' || nextMax === 'invalid') {
      setError('format')
      return
    }
    if (nextMin !== null && nextMax !== null && nextMin > nextMax) {
      setError('order')
      return
    }
    setError(null)
    if (nextMin !== min || nextMax !== max) onChange(nextMin, nextMax)
  }

  const handleClear = () => {
    if (minBox.current) minBox.current.value = ''
    if (maxBox.current) maxBox.current.value = ''
    setError(null)
    onChange(null, null)
  }

  const errorId = `${id}-error`
  const message =
    error === 'format'
      ? 'Enter a price like 25 or 19.99'
      : error === 'order'
        ? "Min price can't be more than max price"
        : null

  return (
    <FilterGroup
      legend="Price"
      clearLabel="Clear price filter"
      canClear={min !== null || max !== null}
      onClear={handleClear}
    >
      <form className={styles.priceForm} onSubmit={handleSubmit} noValidate>
        <div className={styles.priceRow}>
          <label className="visually-hidden" htmlFor={`${id}-min`}>Minimum price</label>
          <input
            id={`${id}-min`}
            ref={minBox}
            className={styles.priceInput}
            type="text"
            inputMode="decimal"
            placeholder="Min"
            defaultValue={min ?? ''}
            aria-invalid={error !== null}
            aria-describedby={message ? errorId : undefined}
          />
          <span aria-hidden="true">–</span>
          <label className="visually-hidden" htmlFor={`${id}-max`}>Maximum price</label>
          <input
            id={`${id}-max`}
            ref={maxBox}
            className={styles.priceInput}
            type="text"
            inputMode="decimal"
            placeholder="Max"
            defaultValue={max ?? ''}
            aria-invalid={error !== null}
            aria-describedby={message ? errorId : undefined}
          />
        </div>
        <button type="submit" className={styles.apply}>
          Apply
        </button>
      </form>
      {message && (
        <p id={errorId} className={styles.error} role="alert">
          {message}
        </p>
      )}
    </FilterGroup>
  )
}
