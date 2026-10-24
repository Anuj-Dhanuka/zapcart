import { useEffect, useRef, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { CartButton } from '../features/cart/components/CartButton.tsx'
import { useFiltersPanel } from '../features/products/filtersPanel.ts'
import { useMediaQuery } from '../hooks/useMediaQuery.ts'
import { parseFilterParams, toFilterParams } from '../features/products/hooks/useProductFilters.ts'
import styles from './Header.module.css'

const LIVE_SEARCH_DELAY_MS = 300

// Turns the search box text into a search filter: trimmed, and blank means no search
function readSearch(text: string): string | null {
  return text.trim() || null
}

// The top bar on every page: filters menu button (listing only; toggles the sidebar on large screens, opens the panel on small ones), logo home link, a product search that updates live on the listing and on Enter everywhere, and the cart button
export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const filtersPanel = useFiltersPanel()
  const isLarge = useMediaQuery('(min-width: 1024px)')
  const onListing = location.pathname === '/'
  const urlSearch = onListing ? parseFilterParams(new URLSearchParams(location.search)).filters.search : null
  const box = useRef<HTMLInputElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (box.current && readSearch(box.current.value) !== urlSearch) box.current.value = urlSearch ?? ''
  }, [urlSearch])
  useEffect(() => () => clearTimeout(timer.current), [])

  // Reads the URL as it is right now (not as of the last render), so a filter changed while the timer was waiting is kept
  const applySearch = () => {
    clearTimeout(timer.current)
    const stillOnListing = window.location.pathname === '/'
    const current = parseFilterParams(new URLSearchParams(stillOnListing ? window.location.search : '')).filters
    const search = readSearch(box.current?.value ?? '')
    if (stillOnListing && search === current.search) return
    navigate(
      { pathname: '/', search: toFilterParams({ ...current, search }, 1).toString() },
      { replace: stillOnListing, preventScrollReset: true },
    )
  }

  const handleInput = () => {
    if (!onListing) return
    clearTimeout(timer.current)
    timer.current = setTimeout(applySearch, LIVE_SEARCH_DELAY_MS)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    applySearch()
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {onListing && (
          <button
            type="button"
            className={styles.menu}
            onClick={isLarge ? filtersPanel.toggle : filtersPanel.open}
            aria-label="Filters"
            aria-expanded={filtersPanel.isOpen}
            aria-controls="filters-panel"
            aria-haspopup={isLarge ? undefined : 'dialog'}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
        <Link to="/" className={styles.logo}>zapcart</Link>
        <form role="search" className={styles.search} onSubmit={handleSubmit}>
          <label htmlFor="site-search" className="visually-hidden">Search products</label>
          <svg className={styles.icon} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={box}
            id="site-search"
            name="q"
            type="search"
            className={styles.input}
            placeholder="Search products…"
            defaultValue={urlSearch ?? ''}
            onChange={handleInput}
          />
        </form>
        <CartButton />
      </div>
    </header>
  )
}
