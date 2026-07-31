'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, CircleDashed, AlertCircle } from 'lucide-react'
import { approveProjectQuote } from '@/app/actions/client'
import { useRouter } from 'next/navigation'

export function ClientProjectList({ projects, t }: { projects: any[], t: any }) {
  const router = useRouter()
  const [isApproving, setIsApproving] = useState<string | null>(null)

  async function handleApprove(projectId: string) {
    if (!confirm("Are you sure you want to accept this quote and proceed to Contract & DP?")) return
    
    setIsApproving(projectId)
    const res = await approveProjectQuote(projectId)
    setIsApproving(null)
    
    if (res.success) {
      alert("Quote approved! Proceeding to Contract.")
      router.refresh()
    } else {
      alert("Error: " + res.error)
    }
  }

  if (projects.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <p className="text-slate-500">No active projects yet.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {projects.map((project) => {
        let statusIcon = <CircleDashed className="w-6 h-6 text-blue-600" />
        let statusBg = "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
        let statusText = "Requested"

        if (project.status === "WORKER_REVIEW") {
          statusIcon = <AlertCircle className="w-6 h-6 text-amber-600" />
          statusBg = "bg-amber-50 dark:bg-amber-900/20 text-amber-600"
          statusText = "Action Required"
        } else if (project.status === "PENDING_DP") {
          statusIcon = <Clock className="w-6 h-6 text-purple-600" />
          statusBg = "bg-purple-50 dark:bg-purple-900/20 text-purple-600"
          statusText = "Pending DP"
        } else if (project.status === "IN_PROGRESS") {
          statusIcon = <CircleDashed className="w-6 h-6 text-emerald-600" />
          statusBg = "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
          statusText = "In Progress"
        } else if (project.status === "COMPLETED") {
          statusIcon = <CheckCircle2 className="w-6 h-6 text-slate-600" />
          statusBg = "bg-slate-100 dark:bg-slate-800 text-slate-600"
          statusText = "Completed"
        }

        return (
          <div key={project.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusBg.split(' ')[0]} ${statusBg.split(' ')[1]}`}>
                {statusIcon}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">{project.title}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {project.worker ? `Worker: ${project.worker.name}` : 'Waiting for worker'} 
                  {project.offeredPrice && ` • Quote: Rp${Number(project.offeredPrice).toLocaleString('id-ID')}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 text-xs font-medium rounded-full ${statusBg}`}>
                {statusText}
              </div>
              
              {project.status === "WORKER_REVIEW" && (
                <button 
                  onClick={() => handleApprove(project.id)}
                  disabled={isApproving === project.id}
                  className="px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isApproving === project.id ? "Approving..." : "Accept Quote"}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
