import * as Switch from '@radix-ui/react-switch'
import { useEffect, useState } from 'react'
import type { EndNodeData } from '../../types/workflow'

type EndFormProps = {
  value: EndNodeData
  onChange: (value: EndNodeData) => void
}

export function EndForm({ value, onChange }: EndFormProps) {
  const [form, setForm] = useState<EndNodeData>(value)

  useEffect(() => {
    setForm(value)
  }, [value])

  const apply = (next: EndNodeData) => {
    setForm(next)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-slate-300">
        End Message
        <textarea
          rows={4}
          value={form.endMessage}
          onChange={(event) => apply({ ...form, endMessage: event.target.value })}
          className="mt-1 w-full rounded-md border border-border bg-slate-900 px-2 py-1.5 text-sm text-slate-100"
        />
      </label>

      <div className="flex items-center justify-between rounded-md border border-border bg-slate-900 px-3 py-2">
        <span className="text-xs text-slate-300">Include Summary Flag</span>
        <Switch.Root
          checked={form.summaryFlag}
          onCheckedChange={(checked) => apply({ ...form, summaryFlag: checked })}
          className="relative h-5 w-9 rounded-full bg-slate-700 outline-none data-[state=checked]:bg-primary"
        >
          <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-4" />
        </Switch.Root>
      </div>
    </div>
  )
}
