import { useState, useEffect } from 'react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export type ToastType = Toast['type']
export type { Toast }

class ToastStore {
  private toasts: Toast[] = []
  private listeners: Array<(toasts: Toast[]) => void> = []

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.toasts]))
  }

  private addToast(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = { id, ...toast }
    
    this.toasts.push(newToast)
    this.notify()

    const duration = toast.duration || 5000
    setTimeout(() => {
      this.removeToast(id)
    }, duration)

    return id
  }

  removeToast(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id)
    this.notify()
  }

  success(title: string, message?: string, duration?: number) {
    return this.addToast({ type: 'success', title, message, duration })
  }

  error(title: string, message?: string, duration?: number) {
    return this.addToast({ type: 'error', title, message, duration })
  }

  warning(title: string, message?: string, duration?: number) {
    return this.addToast({ type: 'warning', title, message, duration })
  }

  info(title: string, message?: string, duration?: number) {
    return this.addToast({ type: 'info', title, message, duration })
  }

  clear() {
    this.toasts = []
    this.notify()
  }

  getToasts() {
    return [...this.toasts]
  }
}

export const toast = new ToastStore()

export function useToastStore() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const unsubscribe = toast.subscribe(setToasts)
    setToasts(toast.getToasts()) // Initialize with current toasts
    return unsubscribe
  }, [])

  return {
    toasts,
    removeToast: (id: string) => toast.removeToast(id),
    clearAll: () => toast.clear()
  }
}