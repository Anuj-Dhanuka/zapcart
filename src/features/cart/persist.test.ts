import { describe, expect, it } from 'vitest'
import { makeStore } from '../../store/store.ts'
import { addItem, openDrawer } from './cartSlice.ts'
import { CART_STORAGE_KEY, loadCartItems, persistCart, saveCartItems } from './persist.ts'

// An in-memory stand-in for localStorage that also counts how often it was written
function fakeStorage(initial?: string) {
  const data = new Map<string, string>(initial === undefined ? [] : [[CART_STORAGE_KEY, initial]])
  return {
    writes: 0,
    getItem: (key: string) => data.get(key) ?? null,
    setItem(key: string, value: string) {
      this.writes++
      data.set(key, value)
    },
  }
}

const phone = { id: 1, title: 'Phone', price: 499.99, thumbnail: 'phone.jpg', quantity: 2 }

describe('cart persistence', () => {
  it('loads an empty cart when nothing is saved or storage is unavailable', () => {
    expect(loadCartItems(fakeStorage())).toEqual([])
    expect(loadCartItems(null)).toEqual([])
  })

  it('round-trips saved items', () => {
    const storage = fakeStorage()
    saveCartItems([phone], storage)
    expect(loadCartItems(storage)).toEqual([phone])
  })

  it('ignores broken JSON and anything that is not a list', () => {
    expect(loadCartItems(fakeStorage('{not json'))).toEqual([])
    expect(loadCartItems(fakeStorage('{"id":1}'))).toEqual([])
  })

  it('drops invalid items but keeps the valid ones', () => {
    const saved = JSON.stringify([phone, { ...phone, id: 2, quantity: 0 }, { ...phone, id: 3, price: '5' }, null])
    expect(loadCartItems(fakeStorage(saved))).toEqual([phone])
  })

  it('does not throw when storage refuses to save', () => {
    const full = { getItem: () => null, setItem: () => { throw new Error('QuotaExceededError') } }
    expect(() => saveCartItems([phone], full)).not.toThrow()
  })

  it('saves when the items change, but not for drawer-only changes', () => {
    const storage = fakeStorage()
    const store = makeStore()
    persistCart(store, storage)
    store.dispatch(openDrawer())
    expect(storage.writes).toBe(0)
    store.dispatch(addItem(phone))
    expect(storage.writes).toBe(1)
    expect(loadCartItems(storage)).toEqual([{ ...phone, quantity: 1 }])
  })
})
