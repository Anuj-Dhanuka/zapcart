import { useRef } from 'react'
import { Navigate } from 'react-router'
import { ErrorState } from '../components/ErrorState.tsx'
import { Pagination } from '../components/Pagination.tsx'
import { Spinner } from '../components/Spinner.tsx'
import { AddToCartButton } from '../features/cart/components/AddToCartButton.tsx'
import { BrandFilter } from '../features/products/components/BrandFilter.tsx'
import { CategoryFilter } from '../features/products/components/CategoryFilter.tsx'
import { FilterSidebar } from '../features/products/components/FilterSidebar.tsx'
import { PriceFilter } from '../features/products/components/PriceFilter.tsx'
import { ProductGrid } from '../features/products/components/ProductGrid.tsx'
import { applyFilters, getBrands, PAGE_SIZE, paginate } from '../features/products/filters.ts'
import { toFilterParams, useProductFilters } from '../features/products/hooks/useProductFilters.ts'
import { useProducts } from '../features/products/hooks/useProducts.ts'
import styles from './ProductListPage.module.css'

// The listing page: filters on the left (or in the slide-in panel), and one page of matching products on the right
export function ProductListPage() {
  const { filters, page, setCategories, setPriceRange, setBrands, clearFilters } = useProductFilters()
  const products = useProducts(filters.categories)
  const heading = useRef<HTMLHeadingElement>(null)

  const filtered = products.status === 'success' ? applyFilters(products.data, filters) : []
  const current = paginate(filtered, page)
  const brandOptions = products.status === 'success' ? getBrands(products.data) : null
  const activeFilterCount =
    filters.categories.length + filters.brands.length + (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0)
  const hasActiveFilters = activeFilterCount > 0
  const pageOutOfRange = products.status === 'success' && current.page !== page
  const firstShown = (current.page - 1) * PAGE_SIZE + 1
  const lastShown = firstShown + current.items.length - 1

  const hrefFor = (target: number) => {
    const query = toFilterParams(filters, target).toString()
    return query ? `/?${query}` : '/'
  }

  return (
    <div className={styles.layout}>
      <FilterSidebar
        resultCount={products.status === 'success' ? filtered.length : null}
        activeCount={activeFilterCount}
        onClearAll={clearFilters}
      >
        <CategoryFilter selected={filters.categories} onChange={setCategories} />
        <PriceFilter min={filters.minPrice} max={filters.maxPrice} onChange={setPriceRange} />
        {products.status !== 'error' && (
          <BrandFilter brands={brandOptions} selected={filters.brands} onChange={setBrands} />
        )}
      </FilterSidebar>
      <section className={styles.results}>
        <div className={styles.content}>
          <title>{filters.search ? `Results for "${filters.search}" · zapcart` : 'Products · zapcart'}</title>
          <h1 ref={heading} tabIndex={-1}>
            {filters.search ? `Results for "${filters.search}"` : 'Products'}
          </h1>
          <p className="visually-hidden" aria-live="polite" aria-atomic="true">
            {products.status === 'success' && `${filtered.length} ${filtered.length === 1 ? 'product' : 'products'} found`}
          </p>
          {pageOutOfRange && <Navigate to={hrefFor(current.page)} replace />}
          {products.status === 'loading' && (
            <div className={styles.loading}>
              <Spinner label="Loading products…" />
            </div>
          )}
          {products.status === 'error' && (
            <ErrorState message={products.error.message} onRetry={products.retry} />
          )}
          {products.status === 'success' && filtered.length === 0 && (
            <div className={styles.empty}>
              <p>{hasActiveFilters ? 'No products match your filters.' : 'No products found.'}</p>
              {hasActiveFilters && (
                <button
                  type="button"
                  className={styles.emptyAction}
                  onClick={() => {
                    clearFilters()
                    heading.current?.focus()
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
          {products.status === 'success' && filtered.length > 0 && (
            <ProductGrid
              products={current.items}
              renderAction={(product) => <AddToCartButton product={product} variant="compact" />}
            />
          )}
        </div>
        {products.status === 'success' && (
          <div className={styles.pager}>
            <p className={styles.summary}>
              {filtered.length === 0 ? (
                'No products'
              ) : (
                <>
                  <span className={styles.summaryLong}>
                    Showing {firstShown}–{lastShown} of {filtered.length} products
                  </span>
                  <span className={styles.summaryShort}>
                    {firstShown}–{lastShown} of {filtered.length}
                  </span>
                </>
              )}
            </p>
            <Pagination
              page={current.page}
              totalPages={current.totalPages}
              hrefFor={hrefFor}
              onNavigate={() => heading.current?.focus({ preventScroll: true })}
            />
          </div>
        )}
      </section>
    </div>
  )
}
