import type { ProductSummary } from '../types.ts'
import { ProductCard } from './ProductCard.tsx'
import styles from './ProductGrid.module.css'

type ProductGridProps = {
  products: ProductSummary[]
}

// Lays out product cards in a grid that picks 2, 3 or 4 columns from the space it actually has (container queries)
export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className={styles.container}>
      <ul className={styles.grid}>
        {products.map((product) => (
          <li key={product.id} className={styles.item}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
