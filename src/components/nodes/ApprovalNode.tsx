import type { NodeProps } from '@xyflow/react'
import type { ApprovalNodeData } from '../../types/workflow'
import { BaseCustomNode } from './BaseCustomNode'

export function ApprovalNode({ data, selected }: NodeProps) {
  const node = data as unknown as ApprovalNodeData

  return (
    <BaseCustomNode nodeType="approval" label={node.title ?? node.label} selected={selected}>
      <p className="text-xs text-slate-300">Role: {node.approverRole || 'Manager'}</p>
    </BaseCustomNode>
  )
}
