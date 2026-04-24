import { motion } from 'framer-motion'
import { CheckCircle2, ClipboardList, PlayCircle, UserCheck, Zap } from 'lucide-react'
import type { DragEvent } from 'react'
import type { NodeType } from '../../types/workflow'

const DRAG_MIME = 'application/hr-workflow-node'

const nodeCards: { type: NodeType; label: string; Icon: typeof PlayCircle }[] = [
  { type: 'start', label: 'Start', Icon: PlayCircle },
  { type: 'task', label: 'Task', Icon: ClipboardList },
  { type: 'approval', label: 'Approval', Icon: UserCheck },
  { type: 'automated', label: 'Automated', Icon: Zap },
  { type: 'end', label: 'End', Icon: CheckCircle2 },
]

export function DraggableSidebar() {
  const onDragStart = (event: DragEvent<HTMLDivElement>, type: NodeType) => {
    event.dataTransfer.setData(DRAG_MIME, type)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="rounded-lg border border-border bg-node p-4 text-slate-100">
      <h2 className="text-sm font-semibold text-slate-100">Node Library</h2>
      <p className="mt-1 text-xs text-slate-400">Drag a node into the canvas.</p>

      <div className="mt-4 space-y-2">
        {nodeCards.map(({ type, label, Icon }) => (
          <motion.div
            key={type}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-md"
          >
            <div
              draggable
              onDragStart={(event) => onDragStart(event, type)}
              className="flex cursor-grab items-center gap-2 rounded-md border border-border bg-slate-900 px-3 py-2 text-sm active:cursor-grabbing"
            >
              <Icon size={16} className="text-primary" />
              <span>{label}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </aside>
  )
}
