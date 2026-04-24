import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
  type XYPosition,
} from '@xyflow/react'
import { create } from 'zustand'
import type {
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
  NodeType,
  SimStep,
  SimulationResult,
  StartNodeData,
  TaskNodeData,
} from '../types/workflow'

type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData

type ToastKind = 'info' | 'error'

type ToastState = {
  id: number
  message: string
  kind: ToastKind
}

type WorkflowStore = {
  nodes: Node[]
  edges: Edge[]
  selectedNodeId: string | null
  selectedEdgeId: string | null
  isDark: boolean
  isSimulationPanelOpen: boolean
  simulationResults: SimulationResult | null
  isSimulating: boolean
  toast: ToastState | null
  addNode: (type: NodeType, position: XYPosition) => void
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void
  setSelectedNode: (id: string | null) => void
  setSelectedEdge: (id: string | null) => void
  deleteSelectedElements: () => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  clearCanvas: () => void
  toggleTheme: () => void
  setSimulationPanelOpen: (open: boolean) => void
  showToast: (message: string, kind?: ToastKind) => void
  clearToast: () => void
  setSimulationResults: (
    r: SimulationResult | null | ((current: SimulationResult | null) => SimulationResult | null),
  ) => void
  setIsSimulating: (v: boolean) => void
}

const THEME_KEY = 'hr-workflow-theme'

const nowIso = new Date().toISOString()

const sampleSteps: SimStep[] = [
  { nodeId: 'start-1', nodeLabel: 'Employee Intake', status: 'done', message: 'Intake created' },
  { nodeId: 'task-1', nodeLabel: 'Collect Documents', status: 'done', message: 'HR checklist complete' },
  { nodeId: 'approval-1', nodeLabel: 'Manager Approval', status: 'pending', message: 'Waiting for manager review' },
]

const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 60, y: 160 },
    data: {
      id: 'start-1',
      type: 'start',
      label: 'Start',
      title: 'Employee Intake',
      metadata: [
        { key: 'source', value: 'job-portal' },
        { key: 'createdAt', value: nowIso },
      ],
    },
  },
  {
    id: 'task-1',
    type: 'task',
    position: { x: 300, y: 160 },
    data: {
      id: 'task-1',
      type: 'task',
      label: 'Task',
      title: 'Collect Documents',
      description: 'Gather ID proof, address proof, and tax forms',
      assignee: 'HR Specialist',
      dueDate: '2026-05-01',
      customFields: [{ key: 'priority', value: 'high' }],
    },
  },
  {
    id: 'approval-1',
    type: 'approval',
    position: { x: 560, y: 160 },
    data: {
      id: 'approval-1',
      type: 'approval',
      label: 'Approval',
      title: 'Manager Approval',
      approverRole: 'Hiring Manager',
      autoApproveThreshold: 10000,
    },
  },
  {
    id: 'automated-1',
    type: 'automated',
    position: { x: 840, y: 160 },
    data: {
      id: 'automated-1',
      type: 'automated',
      label: 'Automated',
      title: 'Create System Accounts',
      actionId: 'provision-accounts',
      actionParams: { apps: ['HRMS', 'Email', 'Slack'] },
    },
  },
  {
    id: 'end-1',
    type: 'end',
    position: { x: 1120, y: 160 },
    data: {
      id: 'end-1',
      type: 'end',
      label: 'End',
      endMessage: 'Onboarding Complete',
      summaryFlag: true,
    },
  },
]

const initialEdges: Edge[] = [
  { id: 'e-start-task', source: 'start-1', target: 'task-1' },
  { id: 'e-task-approval', source: 'task-1', target: 'approval-1' },
  { id: 'e-approval-automated', source: 'approval-1', target: 'automated-1' },
  { id: 'e-automated-end', source: 'automated-1', target: 'end-1' },
]

function initialTheme(): boolean {
  if (typeof window === 'undefined') {
    return true
  }

  const saved = window.localStorage.getItem(THEME_KEY)
  if (saved === 'dark') return true
  if (saved === 'light') return false

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function buildNodeData(id: string, type: NodeType): WorkflowNodeData {
  switch (type) {
    case 'start':
      return {
        id,
        type,
        label: 'Start',
        title: 'New Trigger',
        metadata: [],
      }
    case 'task':
      return {
        id,
        type,
        label: 'Task',
        title: 'New Task',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: [],
      }
    case 'approval':
      return {
        id,
        type,
        label: 'Approval',
        title: 'New Approval',
        approverRole: '',
        autoApproveThreshold: 0,
      }
    case 'automated':
      return {
        id,
        type,
        label: 'Automated',
        title: 'New Automation',
        actionId: '',
        actionParams: {},
      }
    case 'end':
      return {
        id,
        type,
        label: 'End',
        endMessage: 'Workflow Completed',
        summaryFlag: true,
      }
    default:
      return {
        id,
        type: 'task',
        label: 'Task',
        title: 'New Task',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: [],
      }
  }
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  selectedEdgeId: null,
  isDark: initialTheme(),
  isSimulationPanelOpen: false,
  simulationResults: {
    steps: sampleSteps,
    valid: true,
    errors: [],
  },
  isSimulating: false,
  toast: null,
  addNode: (type, position) =>
    set((state) => {
      const id = `${type}-${Date.now()}`
      const node: Node = {
        id,
        type,
        position,
        data: buildNodeData(id, type) as unknown as Record<string, unknown>,
      }

      return { nodes: [...state.nodes, node], selectedNodeId: id }
    }),
  updateNodeData: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: { ...((node.data ?? {}) as Record<string, unknown>), ...data },
            }
          : node,
      ),
    })),
  setSelectedNode: (id) => set(() => ({ selectedNodeId: id })),
  setSelectedEdge: (id) => set(() => ({ selectedEdgeId: id })),
  deleteSelectedElements: () =>
    set((state) => {
      if (state.selectedNodeId) {
        return {
          nodes: state.nodes.filter((node) => node.id !== state.selectedNodeId),
          edges: state.edges.filter(
            (edge) => edge.source !== state.selectedNodeId && edge.target !== state.selectedNodeId,
          ),
          selectedNodeId: null,
        }
      }

      if (state.selectedEdgeId) {
        return {
          edges: state.edges.filter((edge) => edge.id !== state.selectedEdgeId),
          selectedEdgeId: null,
        }
      }

      return {}
    }),
  onNodesChange: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),
  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),
  onConnect: (connection) =>
    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          id: `e-${connection.source}-${connection.target}-${Date.now()}`,
        },
        state.edges,
      ),
    })),
  clearCanvas: () =>
    set(() => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
      simulationResults: null,
    })),
  toggleTheme: () =>
    set((state) => {
      const next = !state.isDark
      if (typeof window !== 'undefined') {
        document.documentElement.classList.toggle('dark', next)
        window.localStorage.setItem(THEME_KEY, next ? 'dark' : 'light')
      }

      return { isDark: next }
    }),
  setSimulationPanelOpen: (open) => set(() => ({ isSimulationPanelOpen: open })),
  showToast: (message, kind = 'info') =>
    set(() => ({
      toast: {
        id: Date.now(),
        message,
        kind,
      },
    })),
  clearToast: () => set(() => ({ toast: null })),
  setSimulationResults: (r) =>
    set((state) => ({
      simulationResults: typeof r === 'function' ? r(state.simulationResults) : r,
    })),
  setIsSimulating: (v) => set(() => ({ isSimulating: v })),
}))
