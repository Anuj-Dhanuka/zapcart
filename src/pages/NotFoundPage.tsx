import { Link } from 'react-router'
import styles from './StatusPage.module.css'

// Shown for any URL that doesn't match a route
export function NotFoundPage() {
  return (
    <div className={styles.page}>
      <title>Page not found · zapcart</title>
      <h1>Page not found</h1>
      <p className={styles.message}>The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className={styles.primary}>
        Go to products
      </Link>
    </div>
  )
}
