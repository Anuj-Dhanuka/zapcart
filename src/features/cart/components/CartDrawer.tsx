import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { QuantityStepper } from '../../../components/QuantityStepper.tsx'
import { formatPrice } from '../../../lib/format.ts'
import { useAppDispatch, useAppSelector } from '../../../store/hooks.ts'
import {
  MAX_QUANTITY,
  closeDrawer,
  removeItem,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  selectIsDrawerOpen,
  setQuantity,
} from '../cartSlice.ts'
import styles from './CartDrawer.module.css'

// The cart as a panel sliding in from the right: each item with its quantity and remove button, then the subtotal; a native modal dialog, so focus stays inside, Escape closes it and focus returns to the cart button
export function CartDrawer() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsDrawerOpen)
  const items = useAppSelector(selectCartItems)
  const count = useAppSelector(selectCartCount)
  const total = useAppSelector(selectCartTotal)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  const close = () => dispatch(closeDrawer())

  // The removed row (and its button) disappears, so focus moves to the drawer's title rather than falling out of the dialog
  const handleRemove = (id: number) => {
    dispatch(removeItem(id))
    titleRef.current?.focus()
  }

  return (
    <dialog
      ref={dialogRef}
      id="cart-drawer"
      className={styles.drawer}
      aria-labelledby="cart-title"
      onClose={close}
      onClick={(event) => event.target === event.currentTarget && close()}
    >
      <div className={styles.header}>
        <h2 ref={titleRef} id="cart-title" className={styles.title} tabIndex={-1}>
          Your cart{count > 0 && ` (${count})`}
        </h2>
        <button type="button" className={styles.close} onClick={close} aria-label="Close cart">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p>Your cart is empty.</p>
          <button type="button" className={styles.primary} onClick={close}>
            Continue shopping
          </button>
        </div>
      ) : (
        <>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.id} className={styles.item}>
                <img className={styles.thumb} src={item.thumbnail} alt="" width="64" height="64" loading="lazy" />
                <div className={styles.itemBody}>
                  <Link to={`/product/${item.id}`} className={styles.name} onClick={close}>
                    {item.title}
                  </Link>
                  <span className={styles.unit}>{formatPrice(item.price)} each</span>
                  <div className={styles.controls}>
                    <QuantityStepper
                      value={item.quantity}
                      min={1}
                      max={MAX_QUANTITY}
                      itemName={item.title}
                      onChange={(quantity) => dispatch(setQuantity({ id: item.id, quantity }))}
                    />
                    <button
                      type="button"
                      className={styles.remove}
                      onClick={() => handleRemove(item.id)}
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <span className={styles.lineTotal}>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className={styles.footer}>
            <p className={styles.subtotal}>
              <span>Subtotal</span>
              <span aria-live="polite">{formatPrice(total)}</span>
            </p>
            <p className={styles.note}>Checkout isn't part of this demo.</p>
            <button type="button" className={styles.primary} onClick={close}>
              Continue shopping
            </button>
          </div>
        </>
      )}
    </dialog>
  )
}
