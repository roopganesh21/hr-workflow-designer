import type { NodeProps } from '@xyflow/react'
import type { StartNodeData } from '../../types/workflow'
import { BaseCustomNode } from './BaseCustomNode'

export function StartNode({ data, selected }: NodeProps) {
  const node = data as unknown as StartNodeData

  return (
    <BaseCustomNode nodeType="start" label={node.title ?? node.label} selected={selected}>
      <p className="text-xs text-slate-300">Metadata: {node.metadata.length}</p>
    </BaseCustomNode>
  )
}
