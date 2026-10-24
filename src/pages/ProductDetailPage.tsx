import { useLocation, useNavigate, useParams } from 'react-router'
import { ErrorState } from '../components/ErrorState.tsx'
import { Spinner } from '../components/Spinner.tsx'
import { ProductGallery } from '../features/products/components/ProductGallery.tsx'
import { ProductInfo } from '../features/products/components/ProductInfo.tsx'
import { ReviewList } from '../features/products/components/ReviewList.tsx'
import { useProduct } from '../features/products/hooks/useProduct.ts'
import { parseProductId } from '../features/products/productId.ts'
import { ApiError } from '../lib/http.ts'
import styles from './ProductDetailPage.module.css'

const NOT_FOUND_MESSAGE = "This product doesn't exist or may have been removed."

// Back to the listing: a real history back when we came from inside the app (keeps filters and scroll), otherwise the listing's home
function BackButton() {
  const navigate = useNavigate()
  const location = useLocation()
  const cameFromApp = location.key !== 'default'

  return (
    <button type="button" className={styles.back} onClick={() => (cameFromApp ? navigate(-1) : navigate('/'))}>
      <span aria-hidden="true">←</span> Back to products
    </button>
  )
}

// Loads one product and shows it, or a not-found / retryable error
function ProductDetails({ id }: { id: number }) {
  const product = useProduct(id)

  if (product.status === 'loading') return <Spinner label="Loading product…" />
  if (product.status === 'error') {
    return product.error instanceof ApiError && product.error.status === 404 ? (
      <ErrorState title="Product not found" message={NOT_FOUND_MESSAGE} />
    ) : (
      <ErrorState message={product.error.message} onRetry={product.retry} />
    )
  }

  const item = product.data
  return (
    <>
      <title>{`${item.title} · zapcart`}</title>
      <div className={styles.layout}>
        <ProductGallery key={item.id} images={item.images} title={item.title} />
        <div className={styles.details}>
          <ProductInfo product={item} />
          <ReviewList reviews={item.reviews} />
        </div>
      </div>
    </>
  )
}

// The product detail page: validates the id from the URL before loading anything
export function ProductDetailPage() {
  const { id: rawId } = useParams()
  const id = parseProductId(rawId)

  return (
    <div className={styles.page}>
      <BackButton />
      {id === null ? (
        <ErrorState title="Product not found" message={NOT_FOUND_MESSAGE} />
      ) : (
        <ProductDetails key={id} id={id} />
      )}
    </div>
  )
}
