import * as Select from '@radix-ui/react-select'
import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ApprovalNodeData } from '../../types/workflow'

type ApprovalFormProps = {
  value: ApprovalNodeData
  onChange: (value: ApprovalNodeData) => void
}

const roles = ['Hiring Manager', 'HR Lead', 'Finance', 'Department Head']

export function ApprovalForm({ value, onChange }: ApprovalFormProps) {
  const [form, setForm] = useState<ApprovalNodeData>(value)

  useEffect(() => {
    setForm(value)
  }, [value])

  const apply = (next: ApprovalNodeData) => {
    setForm(next)
    onChange(next)
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

      <div>
        <span className="text-xs font-medium text-slate-300">Approver Role</span>
        <Select.Root
          value={form.approverRole}
          onValueChange={(role) => apply({ ...form, approverRole: role })}
        >
          <Select.Trigger className="mt-1 flex w-full items-center justify-between rounded-md border border-border bg-slate-900 px-2 py-1.5 text-sm text-slate-100">
            <Select.Value placeholder="Select role" />
            <Select.Icon>
              <ChevronDown size={14} />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="z-50 overflow-hidden rounded-md border border-border bg-slate-900 text-sm text-slate-100 shadow-xl">
              <Select.Viewport className="p-1">
                {roles.map((role) => (
                  <Select.Item
                    key={role}
                    value={role}
                    className="cursor-pointer rounded px-2 py-1.5 outline-none data-[highlighted]:bg-slate-800"
                  >
                    <Select.ItemText>{role}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <label className="block text-xs font-medium text-slate-300">
        Auto-Approve Threshold
        <input
          type="number"
          value={form.autoApproveThreshold}
          onChange={(event) => apply({ ...form, autoApproveThreshold: Number(event.target.value || 0) })}
          className="mt-1 w-full rounded-md border border-border bg-slate-900 px-2 py-1.5 text-sm text-slate-100"
        />
      </label>
    </div>
  )
}
