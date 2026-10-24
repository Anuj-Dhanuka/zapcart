import type { ReactNode } from 'react'
import type { ProductSummary } from '../types.ts'
import { ProductCard } from './ProductCard.tsx'
import styles from './ProductGrid.module.css'

type ProductGridProps = {
  products: ProductSummary[]
  renderAction?: (product: ProductSummary) => ReactNode
}

// Lays out product cards in a grid that picks 2, 3 or 4 columns from the space it actually has (container queries); renderAction adds a control to each card
export function ProductGrid({ products, renderAction }: ProductGridProps) {
  return (
    <div className={styles.container}>
      <ul className={styles.grid}>
        {products.map((product) => (
          <li key={product.id} className={styles.item}>
            <ProductCard product={product} action={renderAction?.(product)} />
          </li>
        ))}
      </ul>
    </div>
  )
}
