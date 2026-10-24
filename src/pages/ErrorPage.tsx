import { useEffect } from 'react'
import { useRouteError } from 'react-router'
import styles from './StatusPage.module.css'

type ErrorPageProps = {
  standalone?: boolean
}

// Shown instead of a page that crashed while rendering: a plain explanation plus ways out, never the raw error. standalone is for when the layout itself crashed, so there is no header or <main> around it
export function ErrorPage({ standalone = false }: ErrorPageProps) {
  const error = useRouteError()

  useEffect(() => {
    console.error(error)
  }, [error])

  const content = (
    <div className={`${styles.page} ${standalone ? styles.standalone : ''}`}>
      <title>Something went wrong · zapcart</title>
      <h1>Something went wrong</h1>
      <p className={styles.message}>
        This page hit an unexpected problem. Reloading usually fixes it; your cart is saved.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={() => window.location.reload()}>
          Reload page
        </button>
        <a href="/" className={styles.secondary}>
          Go to products
        </a>
      </div>
    </div>
  )

  return standalone ? <main>{content}</main> : content
}

// The error page for a crash in the root layout itself (header included)
export function AppErrorPage() {
  return <ErrorPage standalone />
}
