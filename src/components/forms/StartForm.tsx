import { useEffect, useState } from 'react'
import type { KV, StartNodeData } from '../../types/workflow'

type StartFormProps = {
  value: StartNodeData
  onChange: (value: StartNodeData) => void
}

export function StartForm({ value, onChange }: StartFormProps) {
  const [form, setForm] = useState<StartNodeData>(value)

  useEffect(() => {
    setForm(value)
  }, [value])

  const apply = (next: StartNodeData) => {
    setForm(next)
    onChange(next)
  }

  const updateMeta = (index: number, key: keyof KV, content: string) => {
    const next = [...form.metadata]
    next[index] = { ...next[index], [key]: content }
    apply({ ...form, metadata: next })
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-300">Metadata</span>
          <button
            type="button"
            onClick={() => apply({ ...form, metadata: [...form.metadata, { key: '', value: '' }] })}
            className="rounded border border-border px-2 py-1 text-xs"
          >
            Add
          </button>
        </div>

        {form.metadata.map((pair, index) => (
          <div key={`${index}-${pair.key}`} className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <input
              value={pair.key}
              placeholder="key"
              onChange={(event) => updateMeta(index, 'key', event.target.value)}
              className="rounded-md border border-border bg-slate-900 px-2 py-1.5 text-xs text-slate-100"
            />
            <input
              value={pair.value}
              placeholder="value"
              onChange={(event) => updateMeta(index, 'value', event.target.value)}
              className="rounded-md border border-border bg-slate-900 px-2 py-1.5 text-xs text-slate-100"
            />
            <button
              type="button"
              onClick={() => apply({ ...form, metadata: form.metadata.filter((_, i) => i !== index) })}
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
