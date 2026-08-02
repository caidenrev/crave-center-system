import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { FolderKanban, Users, ShieldAlert, CheckSquare } from 'lucide-react'

export default async function AdminDashboardPage() {
  await requireRole(["ADMIN"])

  // Fetch some basic stats
  const totalUsers = await prisma.user.count()
  const totalProjects = 12 // Placeholder for now
  const pendingApps = await prisma.workerApplication.count({
    where: { status: 'PENDING' }
  })
  const activeRequests = 5 // Placeholder for now

  const stats = [
    { name: 'Total Users', value: totalUsers, icon: Users, color: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' },
    { name: 'Active Projects', value: totalProjects, icon: FolderKanban, color: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' },
    { name: 'Job Requests', value: activeRequests, icon: CheckSquare, color: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400' },
    { name: 'Pending Apps', value: pendingApps, icon: ShieldAlert, color: 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Admin Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back. Here's what's happening across the platform today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-start gap-4 transition-all hover:shadow-md">
            <div className={`p-3 rounded-xl flex-shrink-0 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Platform Activity</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
            <p className="text-slate-400 text-sm">Activity chart will appear here</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Alerts</h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
            <ShieldAlert className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">No new alerts or delays detected.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
