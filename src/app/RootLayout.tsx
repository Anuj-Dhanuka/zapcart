import { useMemo, useState } from 'react'
import { Outlet, ScrollRestoration } from 'react-router'
import { CartDrawer } from '../features/cart/components/CartDrawer.tsx'
import { FiltersPanelContext } from '../features/products/filtersPanel.ts'
import { Header } from './Header.tsx'
import styles from './RootLayout.module.css'

// The frame shared by every page: full-width header on top, the current page below and the cart drawer; it also owns whether the filters panel is open
export function RootLayout() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const filtersPanel = useMemo(
    () => ({
      isOpen: filtersOpen,
      open: () => setFiltersOpen(true),
      close: () => setFiltersOpen(false),
      toggle: () => setFiltersOpen((open) => !open),
    }),
    [filtersOpen],
  )

  return (
    <FiltersPanelContext value={filtersPanel}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <CartDrawer />
      <ScrollRestoration />
    </FiltersPanelContext>
  )
}
