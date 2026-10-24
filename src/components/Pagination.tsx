import { Link } from 'react-router'
import { getPageItems } from './pageItems.ts'
import styles from './Pagination.module.css'

type PaginationProps = {
  page: number
  totalPages: number
  hrefFor: (page: number) => string
  onNavigate?: () => void
}

type StepProps = {
  label: string
  arrow: string
  arrowFirst: boolean
  iconOnly?: boolean
  to: string | null
  onNavigate?: () => void
}

// First/Previous/Next/Last control: a link when there's somewhere to go, a disabled placeholder (same size) when already there
function Step({ label, arrow, arrowFirst, iconOnly = false, to, onNavigate }: StepProps) {
  const content = (
    <>
      {arrowFirst && <span aria-hidden="true">{arrow}</span>}
      <span className={iconOnly ? 'visually-hidden' : styles.stepLabel}>{label}</span>
      {!arrowFirst && <span aria-hidden="true">{arrow}</span>}
    </>
  )
  if (to === null) {
    return (
      <span className={styles.step} aria-disabled="true">
        {content}
      </span>
    )
  }
  return (
    <Link to={to} className={styles.step} onClick={onNavigate}>
      {content}
    </Link>
  )
}

// Page navigation as real links (so filters stay in the URL and pages open in new tabs), with first/last jumps: numbered on wider screens, "Page X of Y" on phones
export function Pagination({ page, totalPages, hrefFor, onNavigate }: PaginationProps) {
  const items = getPageItems(page, totalPages)

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <Step label="First page" arrow="«" arrowFirst iconOnly to={page > 1 ? hrefFor(1) : null} onNavigate={onNavigate} />
      <Step label="Previous" arrow="←" arrowFirst to={page > 1 ? hrefFor(page - 1) : null} onNavigate={onNavigate} />
      <ul className={styles.pages}>
        {items.map((item, index) =>
          item === 'gap' ? (
            <li key={`gap-${index}`} className={styles.gap} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              {item === page ? (
                <span className={styles.current} aria-current="page">
                  <span className="visually-hidden">Page </span>
                  {item}
                </span>
              ) : (
                <Link to={hrefFor(item)} className={styles.page} onClick={onNavigate}>
                  <span className="visually-hidden">Page </span>
                  {item}
                </Link>
              )}
            </li>
          ),
        )}
      </ul>
      <p className={styles.compact}>
        Page {page} of {totalPages}
      </p>
      <Step
        label="Next"
        arrow="→"
        arrowFirst={false}
        to={page < totalPages ? hrefFor(page + 1) : null}
        onNavigate={onNavigate}
      />
      <Step
        label="Last page"
        arrow="»"
        arrowFirst={false}
        iconOnly
        to={page < totalPages ? hrefFor(totalPages) : null}
        onNavigate={onNavigate}
      />
    </nav>
  )
}
