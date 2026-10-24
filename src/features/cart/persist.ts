import { browserStorage } from '../../lib/storage.ts'
import type { AppStore } from '../../store/store.ts'
import { MAX_QUANTITY, selectCartItems, type CartItem } from './cartSlice.ts'

export const CART_STORAGE_KEY = 'zapcart:cart:v1'

// Checks one saved entry really is a cart item, since anything can end up in localStorage
function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  return (
    Number.isInteger(item.id) &&
    typeof item.title === 'string' &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    typeof item.thumbnail === 'string' &&
    Number.isInteger(item.quantity) &&
    (item.quantity as number) >= 1 &&
    (item.quantity as number) <= MAX_QUANTITY
  )
}

// Reads the cart saved last visit, keeping only valid items; anything unreadable means an empty cart
export function loadCartItems(storage = browserStorage()): CartItem[] {
  try {
    const saved: unknown = JSON.parse(storage?.getItem(CART_STORAGE_KEY) ?? '[]')
    return Array.isArray(saved) ? saved.filter(isCartItem) : []
  } catch {
    return []
  }
}

// Saves the cart items; a full or blocked storage just means the cart isn't remembered
export function saveCartItems(items: CartItem[], storage = browserStorage()): void {
  try {
    storage?.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    return
  }
}

// Saves the cart whenever its items change (not on every action), and returns a function that stops saving
export function persistCart(store: AppStore, storage = browserStorage()): () => void {
  let saved = selectCartItems(store.getState())
  return store.subscribe(() => {
    const items = selectCartItems(store.getState())
    if (items === saved) return
    saved = items
    saveCartItems(items, storage)
  })
}
