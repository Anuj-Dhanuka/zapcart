import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchProducts } from './api.ts'

// Replaces fetch with a fake that answers each URL from a small table and records what was requested
function fakeFetch(responses: Record<string, unknown[] | 'fail'>) {
  const requested: string[] = []
  const fetchMock = vi.fn(async (url: string) => {
    const path = new URL(url).pathname
    requested.push(path)
    const products = responses[path]
    if (products === 'fail') return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
    return new Response(JSON.stringify({ products, total: products.length, skip: 0, limit: 0 }))
  })
  vi.stubGlobal('fetch', fetchMock)
  return requested
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchProducts', () => {
  it('asks for every product with one request when no category is chosen', async () => {
    const requested = fakeFetch({ '/products': [{ id: 1 }, { id: 2 }] })
    expect(await fetchProducts([])).toEqual([{ id: 1 }, { id: 2 }])
    expect(requested).toEqual(['/products'])
  })

  it('asks for each chosen category and merges the results in order', async () => {
    const requested = fakeFetch({
      '/products/category/laptops': [{ id: 78 }],
      '/products/category/smartphones': [{ id: 121 }, { id: 122 }],
    })
    expect(await fetchProducts(['laptops', 'smartphones'])).toEqual([{ id: 78 }, { id: 121 }, { id: 122 }])
    expect(requested).toEqual(['/products/category/laptops', '/products/category/smartphones'])
  })

  it('fails as a whole when any category request fails', async () => {
    fakeFetch({ '/products/category/laptops': [{ id: 78 }], '/products/category/smartphones': 'fail' })
    await expect(fetchProducts(['laptops', 'smartphones'])).rejects.toThrow('Server error')
  })
})
