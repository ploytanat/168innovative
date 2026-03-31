import { isMockModeEnabled } from "../mock/runtime"

const ENABLED_VALUES = new Set(["1", "true", "yes", "on"])

function isEnvFlagEnabled(value?: string) {
  if (!value) return false
  return ENABLED_VALUES.has(value.trim().toLowerCase())
}

export function shouldGenerateStaticParams() {
  if (isMockModeEnabled()) {
    return true
  }

  return isEnvFlagEnabled(process.env.PRERENDER_DYNAMIC_ROUTES)
}

export async function loadStaticParamsOrSkip<T>(
  loader: () => Promise<T>,
  routeLabel: string
): Promise<T | []> {
  if (!shouldGenerateStaticParams()) {
    return []
  }

  try {
    return await loader()
  } catch (error) {
    console.warn(`[generateStaticParams] Skipping ${routeLabel}.`, error)
    return []
  }
}
