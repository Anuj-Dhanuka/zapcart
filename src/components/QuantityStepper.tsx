import type { Ref } from 'react'
import styles from './QuantityStepper.module.css'

type QuantityStepperProps = {
  value: number
  min: number
  max: number
  itemName: string
  onChange: (value: number) => void
  fullWidth?: boolean
  increaseRef?: Ref<HTMLButtonElement>
}

// A [−] n [+] control (optionally stretched to its container); the buttons name the item for screen readers and the number is announced when it changes.
// With min 0, the last [−] would remove the item, so at 1 it becomes a trash button labelled "Remove … from cart"
export function QuantityStepper({ value, min, max, itemName, onChange, fullWidth = false, increaseRef }: QuantityStepperProps) {
  const removes = min === 0 && value === 1

  return (
    <div className={`${styles.stepper} ${fullWidth ? styles.fullWidth : ''}`} role="group" aria-label={`Quantity of ${itemName}`}>
      <button
        type="button"
        className={styles.step}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={removes ? `Remove ${itemName} from cart` : `Decrease quantity of ${itemName}`}
      >
        {removes ? (
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>
      <output className={styles.value} aria-live="polite">
        {value}
      </output>
      <button
        ref={increaseRef}
        type="button"
        className={styles.step}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase quantity of ${itemName}`}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
