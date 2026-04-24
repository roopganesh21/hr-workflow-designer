import type { NodeProps } from '@xyflow/react'
import type { AutomatedNodeData } from '../../types/workflow'
import { BaseCustomNode } from './BaseCustomNode'

export function AutomatedNode({ data, selected }: NodeProps) {
  const node = data as unknown as AutomatedNodeData

  return (
    <BaseCustomNode nodeType="automated" label={node.title ?? node.label} selected={selected}>
      <p className="text-xs text-slate-300">Action: {node.actionId || 'Not configured'}</p>
    </BaseCustomNode>
  )
}
