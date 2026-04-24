import { useRef } from 'react'
import { simulateWorkflow } from '../api/mockApi'
import { useWorkflowStore } from './useWorkflowStore'
import type { SimulationResult, WorkflowGraph } from '../types/workflow'

export function useSimulate() {
  const timeoutsRef = useRef<number[]>([])

  const nodes = useWorkflowStore((state) => state.nodes)
  const edges = useWorkflowStore((state) => state.edges)
  const isSimulating = useWorkflowStore((state) => state.isSimulating)
  const simulationResults = useWorkflowStore((state) => state.simulationResults)
  const setSimulationResults = useWorkflowStore((state) => state.setSimulationResults)
  const setIsSimulating = useWorkflowStore((state) => state.setIsSimulating)
  const showToast = useWorkflowStore((state) => state.showToast)

  const clearTimers = () => {
    for (const timeout of timeoutsRef.current) {
      window.clearTimeout(timeout)
    }
    timeoutsRef.current = []
  }

  const runSimulation = async (graph?: WorkflowGraph) => {
    clearTimers()
    setIsSimulating(true)
    setSimulationResults(null)

    try {
      const result = await simulateWorkflow(graph ?? { nodes, edges })

      if (!result.valid) {
        setSimulationResults(result)
        showToast('Workflow is invalid. Fix validation errors.', 'error')
        setIsSimulating(false)
        return result
      }

      const seed: SimulationResult = {
        valid: result.valid,
        errors: result.errors,
        steps: result.steps.map((step) => ({ ...step, status: 'pending' })),
      }
      setSimulationResults(seed)

      result.steps.forEach((step, index) => {
        const timeout = window.setTimeout(() => {
          setSimulationResults((current) => {
            if (!current) {
              return {
                valid: result.valid,
                errors: result.errors,
                steps: [],
              }
            }

            const nextSteps = current.steps.map((item, itemIndex) => {
              if (itemIndex < index) {
                return { ...item, status: 'done' as const }
              }
              if (itemIndex === index) {
                return { ...step, status: 'running' as const }
              }
              return item
            })

            return {
              ...current,
              steps: nextSteps,
            }
          })

          const completeTimeout = window.setTimeout(() => {
            setSimulationResults((current) => {
              if (!current) return current
              const nextSteps = current.steps.map((item, itemIndex) =>
                itemIndex === index ? { ...item, status: 'done' as const } : item,
              )

              return {
                ...current,
                steps: nextSteps,
              }
            })

            if (index === result.steps.length - 1) {
              setIsSimulating(false)
            }
          }, 120)

          timeoutsRef.current.push(completeTimeout)
        }, index * 240)

        timeoutsRef.current.push(timeout)
      })

      if (result.steps.length === 0) {
        setIsSimulating(false)
      }

      return result
    } catch {
      setSimulationResults({
        valid: false,
        errors: ['Failed to run simulation'],
        steps: [],
      })
      showToast('Simulation failed to execute.', 'error')
      setIsSimulating(false)
      return null
    }
  }

  return {
    isSimulating,
    simulationResults,
    runSimulation,
  }
}
