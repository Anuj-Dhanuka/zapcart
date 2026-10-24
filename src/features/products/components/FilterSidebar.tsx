import { useEffect, useRef, type ReactNode } from 'react'
import { useMediaQuery } from '../../../hooks/useMediaQuery.ts'
import { useFiltersPanel } from '../filtersPanel.ts'
import styles from './FilterSidebar.module.css'

type FilterSidebarProps = {
  resultCount: number | null
  activeCount: number
  onClearAll: () => void
  children: ReactNode
}

// Holds the filter controls with a Clear all action (in the title row on large screens, beside "Show N products" in the mobile dialog): on large screens a sidebar the header's menu button shows and hides, on smaller ones a slide-in dialog it opens
export function FilterSidebar({ resultCount, activeCount, onClearAll, children }: FilterSidebarProps) {
  const isLarge = useMediaQuery('(min-width: 1024px)')
  const { isOpen, close } = useFiltersPanel()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen, isLarge])

  const handleClearAll = () => {
    onClearAll()
    titleRef.current?.focus()
  }

  const title = (
    <h2 ref={titleRef} id="filters-title" className={styles.title} tabIndex={-1}>
      Filters
    </h2>
  )
  const clearAll = activeCount > 0 && (
    <button
      type="button"
      className={styles.clearAll}
      onClick={handleClearAll}
      aria-label={`Clear all filters (${activeCount} applied)`}
    >
      Clear all <span className={styles.count}>{activeCount}</span>
    </button>
  )

  if (isLarge) {
    return (
      <aside id="filters-panel" className={styles.sidebar} aria-labelledby="filters-title" hidden={!isOpen}>
        <div className={styles.sidebarHeader}>
          {title}
          {clearAll}
        </div>
        {children}
      </aside>
    )
  }

  const showLabel =
    resultCount === null ? 'Show products' : `Show ${resultCount} ${resultCount === 1 ? 'product' : 'products'}`

  return (
    <dialog
      ref={dialogRef}
      id="filters-panel"
      className={styles.panel}
      aria-labelledby="filters-title"
      onClose={close}
      onClick={(event) => event.target === event.currentTarget && close()}
    >
      <div className={styles.panelHeader}>
        {title}
        <button type="button" className={styles.close} onClick={close} aria-label="Close filters">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className={styles.panelBody}>{children}</div>
      <div className={styles.panelFooter}>
        {clearAll}
        <button type="button" className={styles.show} onClick={close}>
          {showLabel}
        </button>
      </div>
    </dialog>
  )
}
