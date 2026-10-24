import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export const MAX_QUANTITY = 10

// One line in the cart: a snapshot of what the shopper saw when they added it, plus how many
export type CartItem = {
  id: number
  title: string
  price: number
  thumbnail: string
  quantity: number
}

// The cart's items (saved between visits) and whether the cart drawer is open (never saved)
export type CartState = {
  items: CartItem[]
  isDrawerOpen: boolean
}

const initialState: CartState = { items: [], isDrawerOpen: false }

// Keeps a quantity a whole number between 1 and MAX_QUANTITY
function clampQuantity(quantity: number): number {
  return Math.min(MAX_QUANTITY, Math.max(1, Math.round(quantity)))
}

// The cart's state and every way it can change; Immer lets the reducers "mutate" a draft safely
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Omit<CartItem, 'quantity'>>) {
      const existing = state.items.find((item) => item.id === action.payload.id)
      if (existing) existing.quantity = clampQuantity(existing.quantity + 1)
      else state.items.push({ ...action.payload, quantity: 1 })
    },
    setQuantity(state, action: PayloadAction<{ id: number; quantity: number }>) {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== id)
        return
      }
      const existing = state.items.find((item) => item.id === id)
      if (existing) existing.quantity = clampQuantity(quantity)
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    openDrawer(state) {
      state.isDrawerOpen = true
    },
    closeDrawer(state) {
      state.isDrawerOpen = false
    },
  },
  selectors: {
    selectCartItems: (state) => state.items,
    selectCartCount: (state) => state.items.reduce((count, item) => count + item.quantity, 0),
    selectCartTotal: (state) => state.items.reduce((total, item) => total + item.price * item.quantity, 0),
    selectQuantityById: (state, id: number) => state.items.find((item) => item.id === id)?.quantity ?? 0,
    selectIsDrawerOpen: (state) => state.isDrawerOpen,
  },
})

export const { addItem, setQuantity, removeItem, openDrawer, closeDrawer } = cartSlice.actions
export const { selectCartItems, selectCartCount, selectCartTotal, selectQuantityById, selectIsDrawerOpen } =
  cartSlice.selectors
export { cartSlice }
