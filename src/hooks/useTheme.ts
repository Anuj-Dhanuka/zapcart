import { useState } from 'react'
import { applyTheme, loadTheme, saveTheme, type Theme } from '../lib/theme.ts'
import { useMediaQuery } from './useMediaQuery.ts'

// The theme on screen (the saved pick, else the system setting, which is followed live) and a toggle that saves the opposite one
export function useTheme(): { theme: Theme; toggle: () => void } {
  const systemDark = useMediaQuery('(prefers-color-scheme: dark)')
  const [saved, setSaved] = useState(loadTheme)
  const theme = saved ?? (systemDark ? 'dark' : 'light')

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    saveTheme(next)
    setSaved(next)
  }

  return { theme, toggle }
}
