import { describe, expect, it } from 'vitest'
import { formatCategoryName, formatDate, formatPrice } from './format.ts'

describe('formatPrice', () => {
  it('formats US dollars with separators and two decimals', () => {
    expect(formatPrice(1899.99)).toBe('$1,899.99')
    expect(formatPrice(5)).toBe('$5.00')
  })
})

describe('formatDate', () => {
  it('formats an ISO date as a short readable date', () => {
    expect(formatDate('2025-04-30T09:41:02.053Z')).toBe('Apr 30, 2025')
  })

  it('uses UTC so late-night times do not shift to another day', () => {
    expect(formatDate('2025-04-30T23:59:00.000Z')).toBe('Apr 30, 2025')
  })
})

describe('formatCategoryName', () => {
  it('turns slugs into display names', () => {
    expect(formatCategoryName('laptops')).toBe('Laptops')
    expect(formatCategoryName('home-decoration')).toBe('Home Decoration')
    expect(formatCategoryName('womens-jewellery')).toBe('Womens Jewellery')
  })
})
