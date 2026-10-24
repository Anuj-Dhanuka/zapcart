import { describe, expect, it } from 'vitest'
import { THEME_STORAGE_KEY, loadTheme, saveTheme } from './theme.ts'

// An in-memory stand-in for localStorage
function fakeStorage(initial?: string) {
  const data = new Map<string, string>(initial === undefined ? [] : [[THEME_STORAGE_KEY, initial]])
  return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => void data.set(key, value) }
}

describe('theme storage', () => {
  it('follows the system (null) when nothing is saved or storage is unavailable', () => {
    expect(loadTheme(fakeStorage())).toBeNull()
    expect(loadTheme(null)).toBeNull()
  })

  it('round-trips a saved theme', () => {
    const storage = fakeStorage()
    saveTheme('dark', storage)
    expect(loadTheme(storage)).toBe('dark')
  })

  it('ignores anything that is not light or dark', () => {
    expect(loadTheme(fakeStorage('purple'))).toBeNull()
  })

  it('does not throw when storage refuses to read or save', () => {
    const broken = { getItem: () => { throw new Error('SecurityError') }, setItem: () => { throw new Error('QuotaExceededError') } }
    expect(loadTheme(broken)).toBeNull()
    expect(() => saveTheme('light', broken)).not.toThrow()
  })
})
