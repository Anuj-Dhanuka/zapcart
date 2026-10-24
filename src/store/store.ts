import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { cartSlice } from '../features/cart/cartSlice.ts'

const rootReducer = combineSlices(cartSlice)

export type RootState = ReturnType<typeof rootReducer>

// Builds the app's Redux store; tests build a fresh one each time, and main.tsx passes in the cart saved last visit
export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({ reducer: rootReducer, preloadedState })
}

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']
