import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { StarRating } from '../../../components/StarRating.tsx'
import { formatPrice } from '../../../lib/format.ts'
import type { ProductSummary } from '../types.ts'
import styles from './ProductCard.module.css'

type ProductCardProps = {
  product: ProductSummary
  action?: ReactNode
}

// One product in the grid; the title link is stretched over the whole card so the entire card is clickable, and an optional action (passed in by the page) sits above that link
export function ProductCard({ product, action }: ProductCardProps) {
  return (
    <article className={styles.card}>
      <img
        className={styles.image}
        src={product.thumbnail}
        alt=""
        width={300}
        height={300}
        loading="lazy"
        decoding="async"
      />
      <h2 className={styles.title}>
        <Link className={styles.link} to={`/product/${product.id}`}>
          {product.title}
        </Link>
      </h2>
      <div className={styles.meta}>
        <span className={styles.price}>{formatPrice(product.price)}</span>
        <StarRating value={product.rating} />
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </article>
  )
}
