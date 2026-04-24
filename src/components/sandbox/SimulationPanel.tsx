import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { Check, Loader2, X } from 'lucide-react'
import { useWorkflowStore } from '../../hooks/useWorkflowStore'

const listVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

function statusBadge(status: string) {
  if (status === 'running') return 'border-amber-500/40 bg-amber-500/10 text-amber-300'
  if (status === 'done') return 'border-green-500/40 bg-green-500/10 text-green-300'
  if (status === 'error') return 'border-red-500/40 bg-red-500/10 text-red-300'
  return 'border-slate-600 bg-slate-700/40 text-slate-300'
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'done') return <Check size={16} className="text-green-400" />
  if (status === 'error') return <X size={16} className="text-red-400" />
  return <Loader2 size={16} className="animate-spin text-amber-400" />
}

export function SimulationPanel() {
  const open = useWorkflowStore((state) => state.isSimulationPanelOpen)
  const setOpen = useWorkflowStore((state) => state.setSimulationPanelOpen)
  const simulationResults = useWorkflowStore((state) => state.simulationResults)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-node text-slate-100 shadow-2xl">
          <div className="border-b border-border px-5 py-4">
            <Dialog.Title className="text-base font-semibold">Simulation Timeline</Dialog.Title>
            <Dialog.Description className="mt-1 text-xs text-slate-400">
              Execution steps for current workflow graph.
            </Dialog.Description>
          </div>

          <div className="max-h-[60vh] space-y-4 overflow-y-auto px-5 py-4">
            {(simulationResults?.errors.length ?? 0) > 0 && (
              <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
                <p className="mb-1 font-semibold">Validation Errors</p>
                <ul className="list-disc space-y-1 pl-4 text-xs">
                  {simulationResults?.errors.map((error, index) => (
                    <li key={`${error}-${index}`}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <motion.ul
              className="space-y-2"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {(simulationResults?.steps ?? []).map((step, index) => (
                <motion.li
                  key={`${step.nodeId}-${step.status}-${index}`}
                  variants={itemVariants}
                  className="flex items-start gap-3 rounded-lg border border-border bg-slate-900/60 p-3"
                >
                  <div className="mt-0.5">
                    <StatusIcon status={step.status} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-slate-100">{step.nodeLabel}</p>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${statusBadge(step.status)}`}
                      >
                        {step.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300">{step.message}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <div className="border-t border-border px-5 py-4">
            <Dialog.Close asChild>
              <button
                type="button"
                className="w-full rounded-md border border-border px-3 py-2 text-sm text-slate-200"
              >
                Close
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
