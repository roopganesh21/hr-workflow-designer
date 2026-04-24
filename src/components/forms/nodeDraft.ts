import type {
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
  NodeType,
  StartNodeData,
  TaskNodeData,
} from '../../types/workflow'

export type NodeDraft =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData

export function fallbackDraft(nodeId: string, type: NodeType): NodeDraft {
  switch (type) {
    case 'start':
      return { id: nodeId, type, label: 'Start', title: '', metadata: [] }
    case 'task':
      return {
        id: nodeId,
        type,
        label: 'Task',
        title: '',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: [],
      }
    case 'approval':
      return { id: nodeId, type, label: 'Approval', title: '', approverRole: '', autoApproveThreshold: 0 }
    case 'automated':
      return { id: nodeId, type, label: 'Automated', title: '', actionId: '', actionParams: {} }
    case 'end':
      return { id: nodeId, type, label: 'End', endMessage: '', summaryFlag: false }
    default:
      return {
        id: nodeId,
        type: 'task',
        label: 'Task',
        title: '',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: [],
      }
  }
}

export function toNodeDraft(nodeId: string, nodeType: NodeType, rawData: Record<string, unknown>): NodeDraft {
  return ({
    id: String(rawData.id ?? nodeId),
    type: nodeType,
    label: String(rawData.label ?? nodeType),
    ...rawData,
  } as unknown) as NodeDraft
}
