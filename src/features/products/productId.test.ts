import { describe, expect, it } from 'vitest'
import { parseProductId } from './productId.ts'

describe('parseProductId', () => {
  it('accepts whole numbers of at least 1', () => {
    expect(parseProductId('1')).toBe(1)
    expect(parseProductId('194')).toBe(194)
  })

  it('rejects anything that is not a positive whole number', () => {
    for (const value of [undefined, '', 'abc', '0', '-3', '1.5', '1e3', ' 7', '12abc', '99999999999999999999']) {
      expect(parseProductId(value)).toBeNull()
    }
  })
})
