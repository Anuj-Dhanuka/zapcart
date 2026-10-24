import { createBrowserRouter } from 'react-router'
import { RootLayout } from './RootLayout.tsx'
import { AppErrorPage, ErrorPage } from '../pages/ErrorPage.tsx'
import { ProductListPage } from '../pages/ProductListPage.tsx'
import { ProductDetailPage } from '../pages/ProductDetailPage.tsx'
import { NotFoundPage } from '../pages/NotFoundPage.tsx'

// Every URL in the app and the page it shows; all pages render inside RootLayout. A page that crashes is replaced by ErrorPage inside the layout (the header keeps working); if the layout itself crashes, AppErrorPage replaces everything
export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: AppErrorPage,
    children: [
      {
        ErrorBoundary: ErrorPage,
        children: [
          { index: true, Component: ProductListPage },
          { path: 'product/:id', Component: ProductDetailPage },
          { path: '*', Component: NotFoundPage },
        ],
      },
    ],
  },
])
