import { useRef } from 'react'
import { flushSync } from 'react-dom'
import { QuantityStepper } from '../../../components/QuantityStepper.tsx'
import { useAppDispatch, useAppSelector } from '../../../store/hooks.ts'
import { MAX_QUANTITY, addItem, openDrawer, selectQuantityById, setQuantity } from '../cartSlice.ts'
import styles from './AddToCartButton.module.css'

type AddToCartButtonProps = {
  product: {
    id: number
    title: string
    price: number
    thumbnail: string
    availabilityStatus: 'In Stock' | 'Low Stock' | 'Out of Stock'
  }
  variant?: 'full' | 'compact'
}

// "Add to cart" until the product is in the cart, then a quantity stepper whose [−] becomes a trash button at 1 (removing the item); disabled when out of stock.
// full (detail page buy bar): the stepper sits beside "View cart". compact (product cards): a card-wide stepper.
export function AddToCartButton({ product, variant = 'full' }: AddToCartButtonProps) {
  const dispatch = useAppDispatch()
  const quantity = useAppSelector((state) => selectQuantityById(state, product.id))
  const addButton = useRef<HTMLButtonElement>(null)
  const viewCart = useRef<HTMLButtonElement>(null)
  const increase = useRef<HTMLButtonElement>(null)
  const { id, title, price, thumbnail } = product
  const compact = variant === 'compact'

  // The clicked control disappears when the button and stepper swap, so the swap is rendered first (flushSync) and focus moves to its replacement instead of being lost
  const handleAdd = () => {
    flushSync(() => dispatch(addItem({ id, title, price, thumbnail })))
    const replacement = compact ? increase.current : viewCart.current
    replacement?.focus()
  }

  // Changes the quantity; going to 0 removes the item, and focus returns to the Add button that replaces the stepper
  const handleQuantity = (next: number) => {
    if (next > 0) {
      dispatch(setQuantity({ id, quantity: next }))
      return
    }
    flushSync(() => dispatch(setQuantity({ id, quantity: 0 })))
    addButton.current?.focus()
  }

  const productName = <span className="visually-hidden">: {title}</span>

  let control
  if (product.availabilityStatus === 'Out of Stock') {
    control = (
      <button type="button" className={styles.add} disabled>
        Out of stock{productName}
      </button>
    )
  } else if (quantity === 0) {
    control = (
      <button ref={addButton} type="button" className={styles.add} onClick={handleAdd}>
        Add to cart{productName}
      </button>
    )
  } else if (compact) {
    control = (
      <QuantityStepper
        value={quantity}
        min={0}
        max={MAX_QUANTITY}
        itemName={title}
        onChange={handleQuantity}
        fullWidth
        increaseRef={increase}
      />
    )
  } else {
    control = (
      <div className={styles.inCart}>
        <span className={styles.label}>In your cart</span>
        <QuantityStepper value={quantity} min={0} max={MAX_QUANTITY} itemName={title} onChange={handleQuantity} />
        <button
          ref={viewCart}
          type="button"
          className={styles.view}
          onClick={() => dispatch(openDrawer())}
          aria-haspopup="dialog"
        >
          View cart
        </button>
      </div>
    )
  }

  return (
    <div className={`${styles.cart} ${compact ? styles.compact : ''}`}>
      {control}
      <p role="status" className="visually-hidden">
        {quantity > 0 ? 'Added to cart' : ''}
      </p>
    </div>
  )
}
