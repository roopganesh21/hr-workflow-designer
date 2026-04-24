import type { NodeProps } from '@xyflow/react'
import type { TaskNodeData } from '../../types/workflow'
import { BaseCustomNode } from './BaseCustomNode'

export function TaskNode({ data, selected }: NodeProps) {
  const node = data as unknown as TaskNodeData

  return (
    <BaseCustomNode nodeType="task" label={node.title ?? node.label} selected={selected}>
      <p className="text-xs text-slate-300">Assignee: {node.assignee || 'Unassigned'}</p>
    </BaseCustomNode>
  )
}
