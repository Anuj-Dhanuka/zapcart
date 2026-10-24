import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router/dom'
import { router } from './app/router.ts'
import { loadCartItems, persistCart } from './features/cart/persist.ts'
import { makeStore } from './store/store.ts'
import './styles/tokens.css'
import './styles/global.css'

const store = makeStore({ cart: { items: loadCartItems(), isDrawerOpen: false } })
persistCart(store)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
