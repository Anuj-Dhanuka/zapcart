// Turns the :id from the URL into a product id: a whole number of at least 1, or null for anything else
export function parseProductId(value: string | undefined): number | null {
  if (!value || !/^\d+$/.test(value)) return null
  const id = Number(value)
  return Number.isSafeInteger(id) && id >= 1 ? id : null
}
