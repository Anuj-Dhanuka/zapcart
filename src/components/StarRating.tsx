import styles from './StarRating.module.css'

type StarRatingProps = {
  value: number
}

// Shows a 0–5 rating as exactly-filled stars plus the number; screen readers hear "Rated 4.5 out of 5"
export function StarRating({ value }: StarRatingProps) {
  const rating = Math.min(Math.max(value, 0), 5)
  const text = (Math.round(rating * 10) / 10).toFixed(1)

  return (
    <span className={styles.rating} role="img" aria-label={`Rated ${text} out of 5`}>
      <span className={styles.stars} aria-hidden="true">
        ★★★★★
        <span className={styles.filled} style={{ width: `${(rating / 5) * 100}%` }}>★★★★★</span>
      </span>
      <span className={styles.value} aria-hidden="true">({text})</span>
    </span>
  )
}
