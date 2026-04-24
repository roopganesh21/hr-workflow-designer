import { Handle, Position } from '@xyflow/react'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  ClipboardList,
  PlayCircle,
  UserCheck,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import clsx from 'clsx'
import type { PropsWithChildren } from 'react'
import type { NodeType } from '../../types/workflow'

type BaseCustomNodeProps = PropsWithChildren<{
  nodeType: NodeType
  label: string
  selected?: boolean
}>

type NodeStyle = {
  icon: LucideIcon
  accent: string
  iconClassName: string
  badgeClassName: string
}

const nodeStyles: Record<NodeType, NodeStyle> = {
  start: {
    icon: PlayCircle,
    accent: '#22c55e',
    iconClassName: 'text-green-400',
    badgeClassName: 'border-green-500/40 bg-green-500/10 text-green-300',
  },
  task: {
    icon: ClipboardList,
    accent: '#3b82f6',
    iconClassName: 'text-blue-400',
    badgeClassName: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
  },
  approval: {
    icon: UserCheck,
    accent: '#f59e0b',
    iconClassName: 'text-amber-400',
    badgeClassName: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  },
  automated: {
    icon: Zap,
    accent: '#a855f7',
    iconClassName: 'text-purple-400',
    badgeClassName: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
  },
  end: {
    icon: CheckCircle2,
    accent: '#ef4444',
    iconClassName: 'text-red-400',
    badgeClassName: 'border-red-500/40 bg-red-500/10 text-red-300',
  },
}

export function BaseCustomNode({ nodeType, label, selected, children }: BaseCustomNodeProps) {
  const style = nodeStyles[nodeType]
  const Icon = style.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      className={clsx(
        'relative min-w-[220px] rounded-lg border border-border bg-node p-3 text-left text-slate-100 shadow-lg transition-all',
        selected && 'ring-2 ring-orange-500',
      )}
      style={{ borderLeft: `4px solid ${style.accent}` }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-slate-900"
        style={{ backgroundColor: style.accent }}
      />

      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon size={18} className={style.iconClassName} />
          <span className="text-sm font-semibold leading-none">{label}</span>
        </div>
        <span
          className={clsx(
            'rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
            style.badgeClassName,
          )}
        >
          {nodeType}
        </span>
      </div>

      {children}

      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-slate-900"
        style={{ backgroundColor: style.accent }}
      />
    </motion.div>
  )
}
