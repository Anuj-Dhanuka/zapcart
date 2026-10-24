import { Link } from 'react-router'

// Shown for any URL that doesn't match a route
export function NotFoundPage() {
  return (
    <section>
      <h1>Page not found</h1>
      <Link to="/">Go to products</Link>
    </section>
  )
}
