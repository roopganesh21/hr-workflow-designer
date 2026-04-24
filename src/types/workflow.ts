import type { Edge, Node } from '@xyflow/react'

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end'

export interface KV {
  key: string
  value: string
}

export interface BaseNodeData {
  id: string
  type: NodeType
  label: string
}

export interface StartNodeData extends BaseNodeData {
  title: string
  metadata: KV[]
}

export interface TaskNodeData extends BaseNodeData {
  title: string
  description: string
  assignee: string
  dueDate: string
  customFields: KV[]
}

export interface ApprovalNodeData extends BaseNodeData {
  title: string
  approverRole: string
  autoApproveThreshold: number
}

export interface AutomatedNodeData extends BaseNodeData {
  title: string
  actionId: string
  actionParams: Record<string, unknown>
}

export interface EndNodeData extends BaseNodeData {
  endMessage: string
  summaryFlag: boolean
}

export interface WorkflowGraph {
  nodes: Node[]
  edges: Edge[]
}

export interface SimStep {
  nodeId: string
  nodeLabel: string
  status: 'pending' | 'running' | 'done' | 'error'
  message: string
}

export interface SimulationResult {
  steps: SimStep[]
  valid: boolean
  errors: string[]
}

export interface WorkflowDefinition {
  id: string
  name: string
  nodes: Node[]
  edges: Edge[]
  updatedAt: string
}

export interface SimulationRequest {
  workflowId: string
  input: Record<string, unknown>
}

export interface SimulationResponse {
  status: 'success' | 'failed'
  durationMs: number
  logs: string[]
}
