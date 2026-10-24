const BASE_URL = 'https://dummyjson.com'

// An error from the API, carrying the HTTP status so the UI can tell "not found" (404) apart from other failures (0 = network error)
export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// Fetches a DummyJSON path and returns the parsed JSON; throws ApiError on network or HTTP failure, and lets cancellations pass through
export async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, { signal })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new ApiError('Could not reach the server. Please check your connection.', 0)
  }

  if (!response.ok) {
    const body: { message?: string } | null = await response.json().catch(() => null)
    throw new ApiError(body?.message ?? `Request failed with status ${response.status}`, response.status)
  }

  return response.json() as Promise<T>
}
