import React, { useState } from "react"
import "../index.css"

const TYPES = ["Bug Report", "Technical Issue", "General Feedback"] as const
const PRIORITIES = ["Low", "Medium", "High"] as const

type Type = (typeof TYPES)[number]
type Priority = (typeof PRIORITIES)[number]

type FormState = {
  username: string
  email: string
  title: string
  description: string
  type: Type
  priority: Priority
  notify: boolean
}

const INITIAL: FormState = {
  username: "",
  email: "",
  title: "",
  description: "",
  type: "Bug Report",
  priority: "Low",
  notify: false,
}

const priorityColors: Record<Priority, { label: string; dot: string; fill: string }> = {
  Low:    { label: "border-emerald-500 bg-emerald-500/10 text-emerald-400", dot: "border-emerald-400", fill: "bg-emerald-400" },
  Medium: { label: "border-amber-500 bg-amber-500/10 text-amber-400",       dot: "border-amber-400",   fill: "bg-amber-400"   },
  High:   { label: "border-red-500 bg-red-500/10 text-red-400",             dot: "border-red-400",     fill: "bg-red-400"     },
}

const inputCls = "w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm"
const pageCls  = "min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800"
const UNSELECTED_RADIO = "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:text-slate-300"

function sanitize(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

function validate(f: FormState): string[] {
  const errs: string[] = []
  const u = f.username.trim()
  const e = f.email.trim()
  const t = f.title.trim()
  const d = f.description.trim()

  if (u.length < 3 || u.length > 20)          errs.push("Username must be between 3 and 20 characters.")
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))  errs.push("Please enter a valid email address.")
  if (t.length < 5 || t.length > 100)         errs.push("Title must be between 5 and 100 characters.")
  if (d.length < 10 || d.length > 1000)       errs.push("Description must be between 10 and 1000 characters.")

  return errs
}

async function submitReport(form: FormState): Promise<{ ok: boolean; error?: string }> {
  const payload = {
    username:    sanitize(form.username.trim()),
    email:       sanitize(form.email.trim()),
    title:       sanitize(form.title.trim()),
    description: sanitize(form.description.trim()),
    type:        form.type,
    priority:    form.priority,
    notify:      form.notify,
  }

  try {
    const res = await fetch("https://api.eternum.lat/submit", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    })
    return res.ok ? { ok: true } : { ok: false, error: `Submission failed: ${res.statusText}` }
  } catch {
    return { ok: false, error: "Network error. Please try again." }
  }
}

// --- UI primitives ---

function CheckIcon({ className, strokeWidth = 2 }: { className: string; strokeWidth?: number }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block">{label}</span>
      {children}
    </label>
  )
}

type OptionClasses = { label: string; dot: string; fill: string }

function RadioGroup<T extends string>({
  name,
  options,
  value,
  onChange,
  getClasses,
  cols = "grid-cols-3",
}: {
  name:       string
  options:    readonly T[]
  value:      T
  onChange:   (v: T) => void
  getClasses: (opt: T, selected: boolean) => OptionClasses
  cols?:      string
}) {
  return (
    <div className={`grid ${cols} gap-2`}>
      {options.map((opt) => {
        const selected = value === opt
        const cls = getClasses(opt, selected)
        return (
          <label
            key={opt}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition select-none text-sm ${cls.label}`}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={selected}
              onChange={() => onChange(opt)}
              className="sr-only"
            />
            <span className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${cls.dot}`}>
              {selected && <span className={`w-1.5 h-1.5 rounded-full ${cls.fill}`} />}
            </span>
            {opt}
          </label>
        )
      })}
    </div>
  )
}

function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className={`${pageCls} p-4`}>
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
          <CheckIcon className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Report submitted</h2>
        <p className="text-slate-400 text-sm mb-6">We'll review it as soon as possible.</p>
        <button
          type="button"
          onClick={onReset}
          className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-medium transition cursor-pointer"
        >
          Submit another
        </button>
      </div>
    </div>
  )
}

// --- Form ---

export function Form() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [done, setDone] = useState(false)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function reset() {
    setForm(INITIAL)
    setDone(false)
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const errors = validate(form)
    if (errors.length > 0) { alert(errors.join("\n")); return }

    const result = await submitReport(form)
    if (result.ok) setDone(true)
    else alert(result.error)
  }

  if (done) return <SuccessScreen onReset={reset} />

  return (
    <div className={`${pageCls} p-4 sm:p-8`}>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5"
      >
        <div>
          <h2 className="text-xl font-bold text-white">Submit a report</h2>
          <p className="text-slate-500 text-sm mt-1">Fill in the details below and we'll look into it.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Username">
            <input
              type="text"
              value={form.username}
              onChange={(e) => set("username", e.target.value)}
              placeholder="your_name"
              maxLength={20}
              autoComplete="username"
              className={inputCls}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@example.com"
              maxLength={50}
              autoComplete="email"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Title">
          <input
            type="text"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Brief description of the issue"
            maxLength={100}
            className={inputCls}
          />
        </Field>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Provide as much detail as possible..."
            maxLength={1000}
            rows={4}
            className={`${inputCls} resize-none`}
          />
          <p className="text-right text-xs text-slate-600">{form.description.length}/1000</p>
        </Field>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block">Type</span>
          <RadioGroup
            name="type"
            options={TYPES}
            value={form.type}
            onChange={(v) => set("type", v)}
            cols="grid-cols-1 sm:grid-cols-3"
            getClasses={(_, selected) => ({
              label: selected ? "border-blue-500 bg-blue-500/10 text-blue-300" : UNSELECTED_RADIO,
              dot:   selected ? "border-blue-400" : "border-slate-600",
              fill:  "bg-blue-400",
            })}
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block">Priority</span>
          <RadioGroup
            name="priority"
            options={PRIORITIES}
            value={form.priority}
            onChange={(v) => set("priority", v)}
            getClasses={(opt, selected) => ({
              label: selected ? priorityColors[opt].label : UNSELECTED_RADIO,
              dot:   selected ? priorityColors[opt].dot : "border-slate-600",
              fill:  priorityColors[opt].fill,
            })}
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.notify}
            onChange={(e) => set("notify", e.target.checked)}
            className="sr-only"
          />
          <div className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition ${form.notify ? "bg-blue-500 border-blue-500" : "border-slate-600 bg-slate-800"}`}>
            {form.notify && <CheckIcon className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
          </div>
          <span className="text-sm text-slate-400">Notify me when this is resolved</span>
        </label>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => setForm(INITIAL)}
            className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300 active:bg-slate-800 text-sm font-medium transition cursor-pointer"
          >
            Reset
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-medium transition cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}
