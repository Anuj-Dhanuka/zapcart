import styles from './ErrorState.module.css'

type ErrorStateProps = {
  title?: string
  message: string
  onRetry?: () => void
}

// A friendly error box with the message and an optional Try again button; screen readers announce it immediately
export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.error} role="alert">
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button type="button" className={styles.button} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
