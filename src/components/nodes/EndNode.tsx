import type { NodeProps } from '@xyflow/react'
import type { EndNodeData } from '../../types/workflow'
import { BaseCustomNode } from './BaseCustomNode'

export function EndNode({ data, selected }: NodeProps) {
  const node = data as unknown as EndNodeData

  return (
    <BaseCustomNode nodeType="end" label={node.endMessage ?? node.label} selected={selected}>
      <p className="text-xs text-slate-300">Summary: {node.summaryFlag ? 'Enabled' : 'Disabled'}</p>
    </BaseCustomNode>
  )
}
