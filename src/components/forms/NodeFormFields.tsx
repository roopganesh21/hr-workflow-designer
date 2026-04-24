import { ApprovalForm } from './ApprovalForm'
import { AutomatedForm } from './AutomatedForm'
import { EndForm } from './EndForm'
import { StartForm } from './StartForm'
import { TaskForm } from './TaskForm'
import type {
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
  NodeType,
  StartNodeData,
  TaskNodeData,
} from '../../types/workflow'
import type { NodeDraft } from './nodeDraft'

type NodeFormFieldsProps = {
  type: NodeType
  draft: NodeDraft
  onChange: (next: NodeDraft) => void
}

export function NodeFormFields({ type, draft, onChange }: NodeFormFieldsProps) {
  if (type === 'start') {
    return <StartForm value={draft as StartNodeData} onChange={onChange} />
  }

  if (type === 'task') {
    return <TaskForm value={draft as TaskNodeData} onChange={onChange} />
  }

  if (type === 'approval') {
    return <ApprovalForm value={draft as ApprovalNodeData} onChange={onChange} />
  }

  if (type === 'automated') {
    return <AutomatedForm value={draft as AutomatedNodeData} onChange={onChange} />
  }

  return <EndForm value={draft as EndNodeData} onChange={onChange} />
}
