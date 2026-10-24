import { createContext, useContext } from 'react'

export type FiltersPanel = {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const FiltersPanelContext = createContext<FiltersPanel | null>(null)

// Lets the header's menu button and the listing page share whether the filters panel is open
export function useFiltersPanel(): FiltersPanel {
  const panel = useContext(FiltersPanelContext)
  if (!panel) throw new Error('useFiltersPanel must be used inside FiltersPanelContext')
  return panel
}
