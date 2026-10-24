import { StarRating } from '../../../components/StarRating.tsx'
import { formatCategoryName, formatPrice } from '../../../lib/format.ts'
import type { Product } from '../types.ts'
import styles from './ProductInfo.module.css'

type ProductInfoProps = {
  product: Product
}

const AVAILABILITY = {
  'In Stock': { label: 'In stock', tone: 'success' },
  'Low Stock': { label: 'Low stock', tone: 'warning' },
  'Out of Stock': { label: 'Out of stock', tone: 'danger' },
} as const

// The product's name, rating, price, availability, brand, category and description
export function ProductInfo({ product }: ProductInfoProps) {
  const availability = AVAILABILITY[product.availabilityStatus]

  return (
    <div className={styles.info}>
      <h1 className={styles.title}>{product.title}</h1>
      <div className={styles.rating}>
        <StarRating value={product.rating} />
      </div>
      <p className={styles.price}>{formatPrice(product.price)}</p>
      {availability && (
        <p className={styles.availability} data-tone={availability.tone}>
          <span className={styles.dot} aria-hidden="true" />
          {availability.label}
        </p>
      )}
      <dl className={styles.facts}>
        {product.brand && (
          <div>
            <dt>Brand</dt>
            <dd>{product.brand}</dd>
          </div>
        )}
        <div>
          <dt>Category</dt>
          <dd>{formatCategoryName(product.category)}</dd>
        </div>
      </dl>
      <section className={styles.description} aria-labelledby="description-title">
        <h2 id="description-title" className={styles.sectionTitle}>
          Description
        </h2>
        <p>{product.description}</p>
      </section>
    </div>
  )
}
