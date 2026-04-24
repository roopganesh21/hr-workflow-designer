import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { NodeFormFields } from './NodeFormFields'
import { fallbackDraft, toNodeDraft, type NodeDraft } from './nodeDraft'
import { useWorkflowStore } from '../../hooks/useWorkflowStore'
import type { NodeType } from '../../types/workflow'

export function NodeFormPanel() {
  const nodes = useWorkflowStore((state) => state.nodes)
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId)
  const setSelectedNode = useWorkflowStore((state) => state.setSelectedNode)
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData)

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId),
    [nodes, selectedNodeId],
  )

  const [draft, setDraft] = useState<NodeDraft | null>(null)

  useEffect(() => {
    if (!selectedNode) {
      setDraft(null)
      return
    }

    const type = selectedNode.type as NodeType
    const raw = selectedNode.data as Record<string, unknown>
    const next = toNodeDraft(selectedNode.id, type, raw)

    setDraft(next ?? fallbackDraft(selectedNode.id, type))
  }, [selectedNode])

  const handleSave = () => {
    if (!selectedNode || !draft) return
    updateNodeData(selectedNode.id, draft)
  }

  return (
    <AnimatePresence>
      {selectedNode && draft ? (
        <motion.aside
          initial={{ x: 320 }}
          animate={{ x: 0 }}
          exit={{ x: 320 }}
          className="fixed right-4 top-20 z-40 h-[calc(100vh-6rem)] w-[320px] overflow-hidden rounded-xl border border-border bg-node shadow-2xl"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-100">Node Configuration</p>
                <p className="text-xs uppercase tracking-wide text-slate-400">{selectedNode.type}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="rounded border border-border p-1 text-slate-300"
                aria-label="Close panel"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              <NodeFormFields
                type={selectedNode.type as NodeType}
                draft={draft}
                onChange={setDraft}
              />
            </div>

            <div className="border-t border-border px-4 py-3">
              <button
                type="button"
                onClick={handleSave}
                className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
