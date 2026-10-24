import { browserStorage } from './storage.ts'

export type Theme = 'light' | 'dark'

// Keep in sync with the inline script in index.html, which applies the saved theme before the first paint
export const THEME_STORAGE_KEY = 'zapcart:theme'

// The theme the user picked last time, or null to follow the system setting
export function loadTheme(storage = browserStorage()): Theme | null {
  try {
    const saved = storage?.getItem(THEME_STORAGE_KEY)
    return saved === 'light' || saved === 'dark' ? saved : null
  } catch {
    return null
  }
}

// Remembers the user's pick; if storage is blocked, the theme still applies for this visit
export function saveTheme(theme: Theme, storage = browserStorage()): void {
  try {
    storage?.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    return
  }
}

// Switches the page's colours: tokens.css reads data-theme on <html> to override the system setting
export function applyTheme(theme: Theme, root: HTMLElement = document.documentElement): void {
  root.dataset.theme = theme
}
