import { useState } from "react"

const TYPES = ["Installation", "Maintenance", "Configuration"] as const

export type ServiceType = (typeof TYPES)[number]

type Service = {
  id: number
  name: string
  mail: string
  type: ServiceType
  description: string
  date: string
  urgent: boolean
}

const INITIAL = {
  name: "",
  mail: "",
  type: "Installation" as ServiceType,
  description: "",
  date: "",
  urgent: false,
}

export function FormValidation(form: typeof INITIAL) {

    if (!/\S+@\S+\.\S+/.test(form.mail)) {
      alert("Email is invalid.")
      return false
    }
    if (form.description === "" || form.description.length <= 10) {
      alert("Description is required and must be at least 10 characters long.")
      return false
    }
    if (form.date === "" || isNaN(Date.parse(form.date))) {
      alert("Date is required.")
      return false
    }
    return true
}


export function FormService() {
  const [services, setServices] = useState<Service[]>([])
  const [form, setForm] = useState(INITIAL)

  function set<K extends keyof typeof INITIAL>(key: K, value: (typeof INITIAL)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!FormValidation(form)) return
    const newService: Service = { id: Date.now(), ...form }
    setServices((prev) => [...prev, newService])
    setForm(INITIAL)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 p-4 sm:p-8">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">Service Request Form</h2>
          <p className="text-slate-500 text-sm mt-1">Submit a service request.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" method="post">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block">Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block">Email</span>
            <input
              type="email"
              name="mail"
              value={form.mail}
              onChange={(e) => set("mail", e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block">Type</span>
            <select
              name="type"
              value={form.type}
              onChange={(e) => set("type", e.target.value as ServiceType)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm resize-none"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block">Date</span>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm"
            />
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              name="urgent"
              checked={form.urgent}
              onChange={(e) => set("urgent", e.target.checked)}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition ${form.urgent ? "bg-blue-500 border-blue-500" : "border-slate-600 bg-slate-800"}`}>
              {form.urgent && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm text-slate-400">Urgent</span>
          </label>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-medium transition cursor-pointer"
          >
            Submit
          </button>
        </form>

        {services.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Submitted Services</h3>
            <div className="space-y-2">
              {services.map((s) => (
                <div key={s.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-slate-300 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{s.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">{s.type}</span>
                    {s.urgent && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">Urgent</span>}
                  </div>
                  <p className="text-slate-400">{s.description}</p>
                  <p className="text-xs text-slate-500">{s.date} &middot; {s.mail}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FormService
