export async function loadWithFallback<T>(
  promise: Promise<T>,
  fallback: T,
  label: string
): Promise<T> {
  try {
    return await promise
  } catch (error) {
    console.error(`Failed to load ${label}:`, error)
    return fallback
  }
}
