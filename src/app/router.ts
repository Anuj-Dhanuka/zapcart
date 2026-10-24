import { createBrowserRouter } from 'react-router'
import { RootLayout } from './RootLayout.tsx'
import { ProductListPage } from '../pages/ProductListPage.tsx'
import { ProductDetailPage } from '../pages/ProductDetailPage.tsx'
import { NotFoundPage } from '../pages/NotFoundPage.tsx'

// Every URL in the app and the page it shows; all pages render inside RootLayout
export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: ProductListPage },
      { path: 'product/:id', Component: ProductDetailPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
