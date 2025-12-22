/* ============================================
   TOAST PROVIDER - Toast notification system
   Layer 5: React Provider (using Zustand)
   ============================================ */

'use client'

import { create } from 'zustand'
import { useCallback, useEffect, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react'

// ============================================
// TYPES
// ============================================

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

// ============================================
// ZUSTAND STORE
// ============================================

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }))
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },
  clearToasts: () => set({ toasts: [] }),
}))

// ============================================
// TOAST ICONS
// ============================================

const toastIcons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const toastColors: Record<ToastType, string> = {
  success: 'bg-xupay-success/10 border-xupay-success/20 text-xupay-success',
  error: 'bg-xupay-error/10 border-xupay-error/20 text-xupay-error',
  warning: 'bg-xupay-warning/10 border-xupay-warning/20 text-xupay-warning',
  info: 'bg-xupay-primary/10 border-xupay-primary/20 text-xupay-primary',
}

// ============================================
// TOAST COMPONENT
// ============================================

interface ToastItemProps {
  toast: Toast
  onRemove: () => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const Icon = toastIcons[toast.type]

  useEffect(() => {
    const duration = toast.duration ?? 5000
    const timer = setTimeout(onRemove, duration)
    return () => clearTimeout(timer)
  }, [toast.duration, onRemove])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm
        w-[420px] max-w-[480px] min-w-0
        ${toastColors[toast.type]}
      `} 
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground">{toast.title}</p>
        {toast.message && (
          <p className="text-sm text-muted-foreground mt-1">{toast.message}</p>
        )}
      </div>
      <button
        onClick={onRemove}
        className="flex-shrink-0 p-1 rounded-md hover:bg-foreground/10 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

// ============================================
// TOAST CONTAINER
// ============================================

function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// PROVIDER
// ============================================

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  )
}

// ============================================
// HOOK
// ============================================

export function useToast() {
  const { addToast, removeToast, clearToasts } = useToastStore()

  const toast = useCallback(
    (options: Omit<Toast, 'id'>) => {
      addToast(options)
    },
    [addToast]
  )

  const success = useCallback(
    (title: string, message?: string) => {
      addToast({ type: 'success', title, message })
    },
    [addToast]
  )

  const error = useCallback(
    (title: string, message?: string) => {
      addToast({ type: 'error', title, message })
    },
    [addToast]
  )

  const warning = useCallback(
    (title: string, message?: string) => {
      addToast({ type: 'warning', title, message })
    },
    [addToast]
  )

  const info = useCallback(
    (title: string, message?: string) => {
      addToast({ type: 'info', title, message })
    },
    [addToast]
  )

  return {
    toast,
    success,
    error,
    warning,
    info,
    remove: removeToast,
    clear: clearToasts,
  }
}
