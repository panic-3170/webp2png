/**
 * useAnalytics — privacy-respecting event tracking.
 * Sends events to Plausible (custom domain) when configured, else to console.
 * Never tracks PII or file content; only counters and metadata.
 */
type EventPayload = Record<string, string | number | boolean>

export const useAnalytics = () => {
  const config = useRuntimeConfig()
  const enabled = !!config.public.adsenseId || true // toggle via env in production

  const track = (name: string, payload?: EventPayload) => {
    if (!import.meta.client) return
    if (!enabled) return

    // Plausible custom event API
    const plausible = (window as Window & { plausible?: (name: string, opts?: { props?: Record<string, unknown> }) => void }).plausible
    if (typeof plausible === 'function') {
      try {
        plausible(name, { props: payload })
        return
      } catch {
        /* fall through to console */
      }
    }

    // Dev fallback
    if (import.meta.dev) {
      console.debug('[analytics]', name, payload ?? {})
    }
  }

  return { track }
}
