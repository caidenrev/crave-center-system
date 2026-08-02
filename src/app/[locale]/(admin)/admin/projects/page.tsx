import { requireRole } from '@/lib/auth'
import { MoreHorizontal, PlayCircle, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function AdminProjectsPage() {
  await requireRole(["ADMIN"])

  // Mock data for UI demonstration
  const projects = [
    { id: 'PRJ-2001', name: 'Crave E-Commerce Revamp', client: 'Acme Corp', manager: 'John Doe', status: 'In Progress', progress: 65, dueDate: 'Nov 15, 2026' },
    { id: 'PRJ-2002', name: 'Mobile App MVP', client: 'TechFlow', manager: 'Sarah Smith', status: 'In Progress', progress: 30, dueDate: 'Dec 01, 2026' },
    { id: 'PRJ-2003', name: 'SEO Optimization Q4', client: 'Global Media', manager: 'Mike Johnson', status: 'Completed', progress: 100, dueDate: 'Oct 01, 2026' },
    { id: 'PRJ-2004', name: 'Brand Identity Redesign', client: 'Stark Ind.', manager: 'Jane Doe', status: 'Delayed', progress: 45, dueDate: 'Oct 10, 2026' },
  ]

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'In Progress':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-800"><PlayCircle className="w-3.5 h-3.5" /> In Progress</span>
      case 'Completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"><CheckCircle className="w-3.5 h-3.5" /> Completed</span>
      case 'Delayed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-800"><Clock className="w-3.5 h-3.5" /> Delayed</span>
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">{status}</span>
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Active Projects</h1>
          <p className="text-slate-500 dark:text-slate-400">Monitor all ongoing client projects and their progress.</p>
        </div>
        <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-xl shadow-sm transition-colors">
          + New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div key={proj.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col transition-all hover:shadow-md hover:border-primary/30 group">
            <div className="flex justify-between items-start mb-4">
              <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 tracking-wider">
                {proj.id}
              </div>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 leading-tight group-hover:text-primary transition-colors">{proj.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Client: {proj.client}</p>
            
            <div className="mt-auto">
              <div className="flex justify-between items-end mb-2">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="block mb-1">Manager</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{proj.manager}</span>
                </div>
                {getStatusBadge(proj.status)}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{proj.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${proj.progress === 100 ? 'bg-emerald-500' : proj.status === 'Delayed' ? 'bg-red-500' : 'bg-primary'}`}
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-2 text-right">
                  Due: {proj.dueDate}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
