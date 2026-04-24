import * as Select from '@radix-ui/react-select'
import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getAutomations, type AutomationAction } from '../../api/mockApi'
import type { AutomatedNodeData } from '../../types/workflow'

type AutomatedFormProps = {
  value: AutomatedNodeData
  onChange: (value: AutomatedNodeData) => void
}

export function AutomatedForm({ value, onChange }: AutomatedFormProps) {
  const [form, setForm] = useState<AutomatedNodeData>(value)
  const [actions, setActions] = useState<AutomationAction[]>([])

  useEffect(() => {
    setForm(value)
  }, [value])

  useEffect(() => {
    const loadAutomations = async () => {
      try {
        const items = await getAutomations()
        setActions(items)
      } catch {
        setActions([])
      }
    }

    void loadAutomations()
  }, [])

  const apply = (next: AutomatedNodeData) => {
    setForm(next)
    onChange(next)
  }

  const selectedAction = actions.find((item) => item.id === form.actionId)

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-slate-300">
        Title
        <input
          value={form.title}
          onChange={(event) => apply({ ...form, title: event.target.value })}
          className="mt-1 w-full rounded-md border border-border bg-slate-900 px-2 py-1.5 text-sm text-slate-100"
        />
      </label>

      <div>
        <span className="text-xs font-medium text-slate-300">Action</span>
        <Select.Root
          value={form.actionId}
          onValueChange={(actionId) => {
            const option = actions.find((item) => item.id === actionId)
            const nextParams = Object.fromEntries((option?.params ?? []).map((param) => [param, '']))
            apply({ ...form, actionId, actionParams: nextParams })
          }}
        >
          <Select.Trigger className="mt-1 flex w-full items-center justify-between rounded-md border border-border bg-slate-900 px-2 py-1.5 text-sm text-slate-100">
            <Select.Value placeholder="Select automation" />
            <Select.Icon>
              <ChevronDown size={14} />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="z-50 overflow-hidden rounded-md border border-border bg-slate-900 text-sm text-slate-100 shadow-xl">
              <Select.Viewport className="p-1">
                {actions.map((action) => (
                  <Select.Item
                    key={action.id}
                    value={action.id}
                    className="cursor-pointer rounded px-2 py-1.5 outline-none data-[highlighted]:bg-slate-800"
                  >
                    <Select.ItemText>{action.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      {selectedAction && (
        <div className="space-y-2">
          <span className="text-xs font-medium text-slate-300">Action Parameters</span>
          {selectedAction.params.map((param) => (
            <label key={param} className="block text-xs text-slate-300">
              {param}
              <input
                value={String(form.actionParams[param] ?? '')}
                onChange={(event) =>
                  apply({
                    ...form,
                    actionParams: {
                      ...form.actionParams,
                      [param]: event.target.value,
                    },
                  })
                }
                className="mt-1 w-full rounded-md border border-border bg-slate-900 px-2 py-1.5 text-sm text-slate-100"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
