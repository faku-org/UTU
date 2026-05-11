import React, { useState } from "react"
import { Form } from "./components/form"
import { FormService } from "./components/formService"

type Project = {
  id: string
  name: string
  description: string
  component: () => React.ReactNode
}

const PROJECTS: Project[] = [
  {
    id: "form",
    name: "Report Form",
    description: "Submit a bug report or feedback with validation and priority selection.",
    component: Form,
  },
  {
    id: "service-form",
    name: "Service Request Form",
    description: "Request a service with options for type, urgency, and scheduling.",
    component: FormService,
  }
]

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left w-full p-5 rounded-xl border border-slate-800 bg-slate-900 hover:border-blue-500/50 hover:bg-slate-800/80 transition cursor-pointer group"
    >
      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition">
        {project.name}
      </h3>
      <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">{project.description}</p>
    </button>
  )
}

function Landing({ projects, onSelect }: { projects: Project[]; onSelect: (p: Project) => void }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Class Projects
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Select a project to explore.
          </p>
        </div>
        <div className="space-y-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onClick={() => onSelect(p)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [active, setActive] = useState<Project | null>(null)

  if (!active) return <Landing projects={PROJECTS} onSelect={setActive} />

  return (
    <div>
      <div className="fixed top-4 left-4 z-50">
        <button
          type="button"
          onClick={() => setActive(null)}
          className="px-4 py-2 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 text-sm font-medium backdrop-blur-sm transition cursor-pointer"
        >
          &larr; Back
        </button>
      </div>
      <active.component />
    </div>
  )
}

export default App
