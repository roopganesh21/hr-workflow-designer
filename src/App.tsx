import {
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type NodeTypes,
} from '@xyflow/react'
import { useCallback, useEffect, useMemo, type DragEvent } from 'react'
import { Toast } from './components/common/Toast'
import { NodeFormPanel } from './components/forms/NodeFormPanel'
import { ApprovalNode } from './components/nodes/ApprovalNode'
import { AutomatedNode } from './components/nodes/AutomatedNode'
import { EndNode } from './components/nodes/EndNode'
import { StartNode } from './components/nodes/StartNode'
import { TaskNode } from './components/nodes/TaskNode'
import { SimulationPanel } from './components/sandbox/SimulationPanel'
import { DraggableSidebar } from './components/sidebar/DraggableSidebar'
import { Toolbar } from './components/toolbar/Toolbar'
import { useWorkflowStore } from './hooks/useWorkflowStore'
import type { NodeType } from './types/workflow'
import '@xyflow/react/dist/style.css'

const DRAG_MIME = 'application/hr-workflow-node'
const validNodeTypes: NodeType[] = ['start', 'task', 'approval', 'automated', 'end']

function WorkflowCanvas() {
  const { screenToFlowPosition } = useReactFlow()
  const nodes = useWorkflowStore((state) => state.nodes)
  const edges = useWorkflowStore((state) => state.edges)
  const isDark = useWorkflowStore((state) => state.isDark)
  const addNode = useWorkflowStore((state) => state.addNode)
  const onNodesChange = useWorkflowStore((state) => state.onNodesChange)
  const onEdgesChange = useWorkflowStore((state) => state.onEdgesChange)
  const onConnect = useWorkflowStore((state) => state.onConnect)
  const setSelectedNode = useWorkflowStore((state) => state.setSelectedNode)
  const setSelectedEdge = useWorkflowStore((state) => state.setSelectedEdge)

  const onDragOver = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault()
      const type = event.dataTransfer.getData(DRAG_MIME) as NodeType | ''
      if (!validNodeTypes.includes(type as NodeType)) {
        return
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      addNode(type as NodeType, position)
    },
    [addNode, screenToFlowPosition],
  )

  const nodeTypes = useMemo<NodeTypes>(
    () => ({
      start: StartNode,
      task: TaskNode,
      approval: ApprovalNode,
      automated: AutomatedNode,
      end: EndNode,
    }),
    [],
  )

  return (
    <section
      className="h-[680px] overflow-hidden rounded-lg border border-border bg-white dark:bg-node"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        className={isDark ? 'dark' : ''}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => {
          setSelectedNode(node.id)
          setSelectedEdge(null)
        }}
        onEdgeClick={(_, edge: Edge) => {
          setSelectedEdge(edge.id)
          setSelectedNode(null)
        }}
        onPaneClick={() => {
          setSelectedNode(null)
          setSelectedEdge(null)
        }}
        fitView
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1.2}
          color={isDark ? '#475569' : '#cbd5e1'}
        />
        <MiniMap pannable zoomable position="bottom-right" />
        <Controls />
      </ReactFlow>
    </section>
  )
}

function App() {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId)
  const deleteSelectedElements = useWorkflowStore((state) => state.deleteSelectedElements)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Delete') return
      const target = event.target as HTMLElement | null
      const isTyping =
        target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable
      if (isTyping) return

      event.preventDefault()
      deleteSelectedElements()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [deleteSelectedElements])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-canvas">
      <Toolbar />
      <main className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[260px_1fr]">
        <DraggableSidebar />
        <ReactFlowProvider>
          <WorkflowCanvas />
        </ReactFlowProvider>
      </main>
      {selectedNodeId ? <NodeFormPanel /> : null}
      <SimulationPanel />
      <Toast />
    </div>
  )
}

export default App
