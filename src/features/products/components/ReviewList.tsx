import { StarRating } from '../../../components/StarRating.tsx'
import { formatDate } from '../../../lib/format.ts'
import type { Review } from '../types.ts'
import styles from './ReviewList.module.css'

type ReviewListProps = {
  reviews: Review[]
}

// Customer reviews: who wrote each one, their rating, when, and what they said
export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <section className={styles.reviews} aria-labelledby="reviews-title">
      <h2 id="reviews-title" className={styles.title}>
        Reviews ({reviews.length})
      </h2>
      {reviews.length === 0 ? (
        <p className={styles.empty}>No reviews yet.</p>
      ) : (
        <ul className={styles.list}>
          {reviews.map((review) => (
            <li key={`${review.reviewerName}-${review.date}`} className={styles.review}>
              <div className={styles.meta}>
                <span className={styles.name}>{review.reviewerName}</span>
                <StarRating value={review.rating} />
                <time className={styles.date} dateTime={review.date}>
                  {formatDate(review.date)}
                </time>
              </div>
              <p className={styles.comment}>{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
