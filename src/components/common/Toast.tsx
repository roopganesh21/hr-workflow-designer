import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useWorkflowStore } from '../../hooks/useWorkflowStore'

export function Toast() {
  const toast = useWorkflowStore((state) => state.toast)
  const clearToast = useWorkflowStore((state) => state.clearToast)

  useEffect(() => {
    if (!toast) return

    const timer = window.setTimeout(() => {
      clearToast()
    }, 2200)

    return () => {
      window.clearTimeout(timer)
    }
  }, [toast, clearToast])

  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-4 right-4 z-[70]"
        >
          <div
            className={`rounded-lg border px-3 py-2 text-sm shadow-xl ${
              toast.kind === 'error'
                ? 'border-red-500/40 bg-red-500/10 text-red-200'
                : 'border-border bg-node text-slate-100'
            }`}
          >
            {toast.message}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
