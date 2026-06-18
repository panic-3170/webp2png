/**
 * useToast — global toast state.
 * Single-instance pattern: a shared `useState` holds the current message;
 * components read/write via `toast` (ref) and `show()`.
 */
export interface ToastMessage {
  id: string
  message: string
  type: 'error' | 'success'
}

export const useToast = () => {
  const toast = useState<ToastMessage | null>('toast', () => null)

  const show = (message: string, type: 'error' | 'success' = 'error') => {
    toast.value = { id: String(Date.now()), message, type }
  }

  const dismiss = () => {
    toast.value = null
  }

  return { toast, show, dismiss }
}
