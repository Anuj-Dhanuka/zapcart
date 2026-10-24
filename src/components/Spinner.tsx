import styles from './Spinner.module.css'

type SpinnerProps = {
  label: string
}

// A spinning circle with a visible label; screen readers announce the label politely, and quick loads never flash it
export function Spinner({ label }: SpinnerProps) {
  return (
    <div className={styles.spinner} role="status">
      <span className={styles.circle} aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
