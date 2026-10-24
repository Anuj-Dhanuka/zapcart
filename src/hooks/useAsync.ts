import { useCallback, useEffect, useState } from 'react'

// The three possible states of a request; each status carries exactly the fields that make sense for it
export type AsyncState<T> =
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: Error }

// A finished result, labelled with the load function and attempt that produced it
type Settled<T> = {
  load: (signal: AbortSignal) => Promise<T>
  attempt: number
  state: AsyncState<T>
}

const LOADING = { status: 'loading', data: null, error: null } as const

// Runs `load` (memoized with useCallback) whenever it changes or retry is called, cancels the previous run, and reports loading/success/error;
// a `cached` value is shown immediately as success while the fresh request runs (stale-while-revalidate)
export function useAsync<T>(
  load: (signal: AbortSignal) => Promise<T>,
  cached?: T,
): AsyncState<T> & { retry: () => void } {
  const [attempt, setAttempt] = useState(0)
  const [settled, setSettled] = useState<Settled<T> | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) setSettled({ load, attempt, state: { status: 'success', data, error: null } })
      },
      (error: unknown) => {
        if (controller.signal.aborted) return
        const normalized = error instanceof Error ? error : new Error(String(error))
        setSettled({ load, attempt, state: { status: 'error', data: null, error: normalized } })
      },
    )
    return () => controller.abort()
  }, [load, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  const isCurrent = settled !== null && settled.load === load && settled.attempt === attempt
  if (isCurrent) return { ...settled.state, retry }
  if (cached !== undefined) return { status: 'success', data: cached, error: null, retry }
  return { ...LOADING, retry }
}
