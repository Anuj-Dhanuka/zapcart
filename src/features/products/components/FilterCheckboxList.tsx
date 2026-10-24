import { useEffect, useRef } from 'react'
import styles from './FilterGroup.module.css'

type FilterCheckboxListProps = {
  name: string
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (values: string[]) => void
}

// Scrolls the list (not the page) so its first ticked item is in view, if it's hidden below or above
function revealFirstChecked(list: HTMLUListElement) {
  const item = list.querySelector('input:checked')?.closest('li')
  if (!item) return
  const isHidden = item.offsetTop < list.scrollTop || item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight
  if (isHidden) list.scrollTop = item.offsetTop - (list.clientHeight - item.offsetHeight) / 2
}

// A scrollable checkbox list; selected values missing from the options stay visible so they can be unticked, changes come back in list order so one selection always gives one URL, and the first ticked item is scrolled into view whenever the list appears
export function FilterCheckboxList({ name, options, selected, onChange }: FilterCheckboxListProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const known = new Set(options.map((option) => option.value))
  const all = [
    ...options,
    ...selected.filter((value) => !known.has(value)).map((value) => ({ value, label: value })),
  ]

  const toggle = (value: string) => {
    const next = selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]
    onChange(all.map((option) => option.value).filter((v) => next.includes(v)))
  }

  const hasOptions = all.length > 0

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    let wasVisible = false
    const observer = new ResizeObserver(() => {
      const isVisible = list.clientHeight > 0
      if (isVisible && !wasVisible) revealFirstChecked(list)
      wasVisible = isVisible
    })
    observer.observe(list)
    return () => observer.disconnect()
  }, [hasOptions])

  if (!hasOptions) return null

  return (
    <ul ref={listRef} className={styles.options}>
      {all.map((option) => (
        <li key={option.value}>
          <label className={styles.option}>
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={selected.includes(option.value)}
              onChange={() => toggle(option.value)}
            />
            {option.label}
          </label>
        </li>
      ))}
    </ul>
  )
}
