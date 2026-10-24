const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

// Formats a price in US dollars, e.g. 1899.99 → "$1,899.99"
export function formatPrice(price: number): string {
  return priceFormatter.format(price)
}

const dateFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

// Formats an ISO date for display, e.g. "2025-04-30T09:41:02Z" → "Apr 30, 2025" (UTC, so it's the same everywhere)
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso))
}

// Turns a category slug into its display name, e.g. "home-decoration" → "Home Decoration"
export function formatCategoryName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
