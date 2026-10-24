import { describe, expect, it } from 'vitest'
import { makeStore } from '../../store/store.ts'
import {
  MAX_QUANTITY,
  addItem,
  closeDrawer,
  openDrawer,
  removeItem,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  selectIsDrawerOpen,
  selectQuantityById,
  setQuantity,
} from './cartSlice.ts'

const phone = { id: 1, title: 'Phone', price: 499.99, thumbnail: 'phone.jpg' }
const case_ = { id: 2, title: 'Case', price: 10, thumbnail: 'case.jpg' }

describe('cart slice', () => {
  it('adds a new product with quantity 1', () => {
    const store = makeStore()
    store.dispatch(addItem(phone))
    expect(selectCartItems(store.getState())).toEqual([{ ...phone, quantity: 1 }])
  })

  it('adds one more when the product is already in the cart, up to the maximum', () => {
    const store = makeStore()
    for (let i = 0; i < MAX_QUANTITY + 3; i++) store.dispatch(addItem(phone))
    expect(selectQuantityById(store.getState(), 1)).toBe(MAX_QUANTITY)
    expect(selectCartItems(store.getState())).toHaveLength(1)
  })

  it('sets a quantity, keeping it a whole number within the limits', () => {
    const store = makeStore()
    store.dispatch(addItem(phone))
    store.dispatch(setQuantity({ id: 1, quantity: 4 }))
    expect(selectQuantityById(store.getState(), 1)).toBe(4)
    store.dispatch(setQuantity({ id: 1, quantity: 99 }))
    expect(selectQuantityById(store.getState(), 1)).toBe(MAX_QUANTITY)
    store.dispatch(setQuantity({ id: 1, quantity: 2.6 }))
    expect(selectQuantityById(store.getState(), 1)).toBe(3)
  })

  it('removes the item when its quantity is set to 0', () => {
    const store = makeStore()
    store.dispatch(addItem(phone))
    store.dispatch(setQuantity({ id: 1, quantity: 0 }))
    expect(selectCartItems(store.getState())).toEqual([])
  })

  it('ignores a quantity change for a product not in the cart', () => {
    const store = makeStore()
    store.dispatch(setQuantity({ id: 7, quantity: 3 }))
    expect(selectCartItems(store.getState())).toEqual([])
  })

  it('removes only the chosen item', () => {
    const store = makeStore()
    store.dispatch(addItem(phone))
    store.dispatch(addItem(case_))
    store.dispatch(removeItem(1))
    expect(selectCartItems(store.getState()).map((item) => item.id)).toEqual([2])
  })

  it('counts items and totals prices by quantity', () => {
    const store = makeStore()
    store.dispatch(addItem(phone))
    store.dispatch(addItem(case_))
    store.dispatch(setQuantity({ id: 2, quantity: 3 }))
    expect(selectCartCount(store.getState())).toBe(4)
    expect(selectCartTotal(store.getState())).toBeCloseTo(529.99)
    expect(selectQuantityById(store.getState(), 99)).toBe(0)
  })

  it('opens and closes the drawer', () => {
    const store = makeStore()
    expect(selectIsDrawerOpen(store.getState())).toBe(false)
    store.dispatch(openDrawer())
    expect(selectIsDrawerOpen(store.getState())).toBe(true)
    store.dispatch(closeDrawer())
    expect(selectIsDrawerOpen(store.getState())).toBe(false)
  })
})
