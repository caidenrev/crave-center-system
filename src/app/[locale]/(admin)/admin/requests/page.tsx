import { requireRole } from '@/lib/auth'
import { Clock, CheckCircle2, AlertCircle, Eye, UserPlus } from 'lucide-react'
import Link from 'next/link'

export default async function AdminRequestsPage() {
  await requireRole(["ADMIN"])

  // Mock data for UI demonstration
  const requests = [
    { id: 'REQ-101', clientName: 'Acme Corp', service: 'E-Commerce Website', budget: '$5,000 - $10,000', status: 'Pending Review', date: 'Oct 12, 2026' },
    { id: 'REQ-102', clientName: 'TechFlow', service: 'Mobile App (iOS/Android)', budget: '$15,000+', status: 'Awaiting Assignment', date: 'Oct 10, 2026' },
    { id: 'REQ-103', clientName: 'Global Media', service: 'SEO Optimization', budget: '$1,000 - $5,000', status: 'Needs Clarification', date: 'Oct 09, 2026' },
  ]

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Pending Review':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-800"><Clock className="w-3.5 h-3.5" /> Pending Review</span>
      case 'Awaiting Assignment':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"><CheckCircle2 className="w-3.5 h-3.5" /> Awaiting Assignment</span>
      case 'Needs Clarification':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-800"><AlertCircle className="w-3.5 h-3.5" /> Clarification</span>
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">{status}</span>
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Job Requests</h1>
        <p className="text-slate-500 dark:text-slate-400">Review incoming project requests from clients and assign them to workers.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Request ID</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Service Required</th>
                <th className="px-6 py-4">Est. Budget</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">{req.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {req.clientName.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-slate-200">{req.clientName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{req.service}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{req.budget}</td>
                  <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{req.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="Assign Worker">
                        <UserPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
