import { motion } from 'framer-motion'
import { Download, Moon, Play, Sun, Trash2 } from 'lucide-react'
import { useSimulate } from '../../hooks/useSimulate'
import { useWorkflowStore } from '../../hooks/useWorkflowStore'

export function Toolbar() {
  const nodes = useWorkflowStore((state) => state.nodes)
  const edges = useWorkflowStore((state) => state.edges)
  const isDark = useWorkflowStore((state) => state.isDark)
  const toggleTheme = useWorkflowStore((state) => state.toggleTheme)
  const clearCanvas = useWorkflowStore((state) => state.clearCanvas)
  const setSimulationPanelOpen = useWorkflowStore((state) => state.setSimulationPanelOpen)
  const showToast = useWorkflowStore((state) => state.showToast)
  const { runSimulation, isSimulating } = useSimulate()

  const exportJson = () => {
    const payload = JSON.stringify({ nodes, edges }, null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'hr-workflow.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const buttonMotion = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-node px-4 py-3 text-slate-100">
      <h1 className="text-base font-semibold">
        <span className="text-primary">HR</span> Workflow Designer
      </h1>

      <div className="flex flex-wrap items-center gap-2">
        <motion.button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs"
          {...buttonMotion}
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
          Theme
        </motion.button>

        <motion.button
          type="button"
          onClick={() => {
            setSimulationPanelOpen(true)
            showToast('Simulation started')
            void runSimulation({ nodes, edges })
          }}
          className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white disabled:opacity-70"
          disabled={isSimulating}
          {...buttonMotion}
        >
          <Play size={14} />
          {isSimulating ? 'Running...' : 'Run Simulation'}
        </motion.button>

        <motion.button
          type="button"
          onClick={exportJson}
          className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs"
          {...buttonMotion}
        >
          <Download size={14} />
          Export JSON
        </motion.button>

        <motion.button
          type="button"
          onClick={clearCanvas}
          className="flex items-center gap-1 rounded-md border border-red-500/40 px-3 py-1.5 text-xs text-red-300"
          {...buttonMotion}
        >
          <Trash2 size={14} />
          Clear Canvas
        </motion.button>
      </div>
    </header>
  )
}
