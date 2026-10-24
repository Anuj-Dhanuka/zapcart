import { useAppDispatch, useAppSelector } from '../../../store/hooks.ts'
import { openDrawer, selectCartCount, selectIsDrawerOpen } from '../cartSlice.ts'
import styles from './CartButton.module.css'

// The header's cart icon with a count badge; it opens the cart drawer, and its name says how many items are inside
export function CartButton() {
  const dispatch = useAppDispatch()
  const count = useAppSelector(selectCartCount)
  const isOpen = useAppSelector(selectIsDrawerOpen)

  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => dispatch(openDrawer())}
      aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls="cart-drawer"
    >
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path
          d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9.5" cy="19" r="1.5" fill="currentColor" />
        <circle cx="17" cy="19" r="1.5" fill="currentColor" />
      </svg>
      {count > 0 && (
        <span className={styles.badge} aria-hidden="true">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
