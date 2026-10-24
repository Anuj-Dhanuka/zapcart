// A category from GET /products/categories (slug for URLs/API, name for display)
export type Category = {
  slug: string
  name: string
}

// The slim product used on the listing page (fetched with ?select=...); some products have no brand, and the stock status lets cards disable Add to cart
export type ProductSummary = {
  id: number
  title: string
  price: number
  rating: number
  thumbnail: string
  category: string
  brand?: string
  availabilityStatus: 'In Stock' | 'Low Stock' | 'Out of Stock'
}

// One customer review, shown on the detail page
export type Review = {
  reviewerName: string
  rating: number
  comment: string
  date: string
}

// The full product from GET /products/{id}
export type Product = ProductSummary & {
  description: string
  images: string[]
  reviews: Review[]
}

// The wrapper every list endpoint returns
export type ProductListResponse = {
  products: ProductSummary[]
  total: number
  skip: number
  limit: number
}

// What the user has chosen in the search box and filter sidebar; null or [] means "no filter"
export type ProductFilters = {
  categories: string[]
  search: string | null
  brands: string[]
  minPrice: number | null
  maxPrice: number | null
}
