import type { SimulationResult, SimStep, WorkflowGraph } from '../types/workflow'

export type AutomationAction = {
  id: string
  label: string
  params: string[]
}

const mockAutomations: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'slack_notify', label: 'Slack Notify', params: ['channel', 'message'] },
  { id: 'update_hris', label: 'Update HRIS', params: ['employeeId', 'field', 'value'] },
]

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(300)
  return mockAutomations
}

function hasCycle(graph: WorkflowGraph): boolean {
  const adjacency = new Map<string, string[]>()
  const visited = new Set<string>()
  const stack = new Set<string>()

  for (const node of graph.nodes) {
    adjacency.set(node.id, [])
  }

  for (const edge of graph.edges) {
    const targets = adjacency.get(edge.source)
    if (targets) {
      targets.push(edge.target)
    }
  }

  const dfs = (nodeId: string): boolean => {
    visited.add(nodeId)
    stack.add(nodeId)

    for (const next of adjacency.get(nodeId) ?? []) {
      if (!visited.has(next) && dfs(next)) {
        return true
      }
      if (stack.has(next)) {
        return true
      }
    }

    stack.delete(nodeId)
    return false
  }

  for (const node of graph.nodes) {
    if (!visited.has(node.id) && dfs(node.id)) {
      return true
    }
  }

  return false
}

function hasDisconnectedNodes(graph: WorkflowGraph): boolean {
  if (graph.nodes.length === 0) {
    return false
  }

  const adjacency = new Map<string, string[]>()
  for (const node of graph.nodes) {
    adjacency.set(node.id, [])
  }

  for (const edge of graph.edges) {
    adjacency.get(edge.source)?.push(edge.target)
    adjacency.get(edge.target)?.push(edge.source)
  }

  const first = graph.nodes[0]?.id
  if (!first) {
    return false
  }

  const visited = new Set<string>()
  const queue = [first]
  visited.add(first)

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) continue

    for (const next of adjacency.get(current) ?? []) {
      if (!visited.has(next)) {
        visited.add(next)
        queue.push(next)
      }
    }
  }

  return visited.size !== graph.nodes.length
}

function nodeLabel(nodeId: string, graph: WorkflowGraph): string {
  const node = graph.nodes.find((item) => item.id === nodeId)
  const data = (node?.data ?? {}) as { label?: string; title?: string }
  return data.title ?? data.label ?? nodeId
}

export async function simulateWorkflow(graph: WorkflowGraph): Promise<SimulationResult> {
  const errors: string[] = []

  const startCount = graph.nodes.filter((node) => node.type === 'start').length
  const endCount = graph.nodes.filter((node) => node.type === 'end').length

  if (startCount !== 1) {
    errors.push('Workflow must contain exactly one Start node')
  }

  if (endCount !== 1) {
    errors.push('Workflow must contain exactly one End node')
  }

  if (hasDisconnectedNodes(graph)) {
    errors.push('Workflow has disconnected nodes')
  }

  if (hasCycle(graph)) {
    errors.push('Workflow contains a cycle')
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      steps: [
        {
          nodeId: 'validation',
          nodeLabel: 'Validation',
          status: 'error',
          message: errors.join('; '),
        },
      ],
    }
  }

  const indegree = new Map<string, number>()
  const adjacency = new Map<string, string[]>()

  for (const node of graph.nodes) {
    indegree.set(node.id, 0)
    adjacency.set(node.id, [])
  }

  for (const edge of graph.edges) {
    adjacency.get(edge.source)?.push(edge.target)
    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1)
  }

  const queue: string[] = []
  for (const [id, degree] of indegree) {
    if (degree === 0) {
      queue.push(id)
    }
  }

  const order: string[] = []
  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) continue

    order.push(current)
    for (const next of adjacency.get(current) ?? []) {
      const degree = (indegree.get(next) ?? 0) - 1
      indegree.set(next, degree)
      if (degree === 0) {
        queue.push(next)
      }
    }
  }

  const steps: SimStep[] = []
  for (const id of order) {
    await delay(200)
    steps.push({
      nodeId: id,
      nodeLabel: nodeLabel(id, graph),
      status: 'done',
      message: `Executed ${nodeLabel(id, graph)}`,
    })
  }

  return {
    steps,
    valid: true,
    errors: [],
  }
}
