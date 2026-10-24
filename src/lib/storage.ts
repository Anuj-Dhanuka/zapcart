export type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>

// The browser's localStorage, or null where it can't be used (private mode, blocked site data, tests)
export function browserStorage(): KeyValueStorage | null {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}
