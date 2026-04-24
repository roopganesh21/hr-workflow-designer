import { useEffect, useState } from 'react'
import type { KV, TaskNodeData } from '../../types/workflow'

type TaskFormProps = {
  value: TaskNodeData
  onChange: (value: TaskNodeData) => void
}

export function TaskForm({ value, onChange }: TaskFormProps) {
  const [form, setForm] = useState<TaskNodeData>(value)

  useEffect(() => {
    setForm(value)
  }, [value])

  const apply = (next: TaskNodeData) => {
    setForm(next)
    onChange(next)
  }

  const updateKV = (index: number, key: keyof KV, content: string) => {
    const next = [...form.customFields]
    next[index] = { ...next[index], [key]: content }
    apply({ ...form, customFields: next })
  }

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

      <label className="block text-xs font-medium text-slate-300">
        Description
        <textarea
          value={form.description}
          onChange={(event) => apply({ ...form, description: event.target.value })}
          rows={3}
          className="mt-1 w-full rounded-md border border-border bg-slate-900 px-2 py-1.5 text-sm text-slate-100"
        />
      </label>

      <label className="block text-xs font-medium text-slate-300">
        Assignee
        <input
          value={form.assignee}
          onChange={(event) => apply({ ...form, assignee: event.target.value })}
          className="mt-1 w-full rounded-md border border-border bg-slate-900 px-2 py-1.5 text-sm text-slate-100"
        />
      </label>

      <label className="block text-xs font-medium text-slate-300">
        Due Date
        <input
          type="date"
          value={form.dueDate}
          onChange={(event) => apply({ ...form, dueDate: event.target.value })}
          className="mt-1 w-full rounded-md border border-border bg-slate-900 px-2 py-1.5 text-sm text-slate-100"
        />
      </label>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-300">Custom Fields</span>
          <button
            type="button"
            onClick={() => apply({ ...form, customFields: [...form.customFields, { key: '', value: '' }] })}
            className="rounded border border-border px-2 py-1 text-xs"
          >
            Add
          </button>
        </div>

        {form.customFields.map((pair, index) => (
          <div key={`${index}-${pair.key}`} className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <input
              value={pair.key}
              placeholder="key"
              onChange={(event) => updateKV(index, 'key', event.target.value)}
              className="rounded-md border border-border bg-slate-900 px-2 py-1.5 text-xs text-slate-100"
            />
            <input
              value={pair.value}
              placeholder="value"
              onChange={(event) => updateKV(index, 'value', event.target.value)}
              className="rounded-md border border-border bg-slate-900 px-2 py-1.5 text-xs text-slate-100"
            />
            <button
              type="button"
              onClick={() => apply({ ...form, customFields: form.customFields.filter((_, i) => i !== index) })}
              className="rounded border border-border px-2 py-1 text-xs"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
