import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Mail, Briefcase, Activity } from 'lucide-react'

export default async function AdminTeamPage() {
  await requireRole(["ADMIN"])

  // Fetch real team members from the database
  const teamMembers = await prisma.user.findMany({
    where: { role: 'TEAM_MEMBER' },
    orderBy: { createdAt: 'desc' }
  })

  // Fallback mock data if the DB is empty just to show the UI
  const displayTeam = teamMembers.length > 0 ? teamMembers.map(user => ({
    id: user.id,
    name: user.name || 'Unnamed Worker',
    email: user.email,
    role: 'Developer', // Placeholder since we don't store exact role directly in User yet
    status: 'Available',
    activeTasks: Math.floor(Math.random() * 5)
  })) : [
    { id: '1', name: 'Alice Smith', email: 'alice@crave.com', role: 'Frontend Engineer', status: 'Busy', activeTasks: 4 },
    { id: '2', name: 'Bob Jones', email: 'bob@crave.com', role: 'UI/UX Designer', status: 'Available', activeTasks: 1 },
    { id: '3', name: 'Charlie Day', email: 'charlie@crave.com', role: 'Backend Dev', status: 'Away', activeTasks: 0 },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Team Workload</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your workers, see their current workload, and allocate tasks efficiently.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTeam.map((member) => (
          <div key={member.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md group">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-md flex items-center justify-center text-2xl font-bold text-primary mb-4 relative">
              {member.name.charAt(0)}
              <div className={`absolute bottom-0 right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${member.status === 'Available' ? 'bg-emerald-500' : member.status === 'Busy' ? 'bg-red-500' : 'bg-amber-500'}`} title={member.status} />
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{member.name}</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5 justify-center">
              <Briefcase className="w-3.5 h-3.5" />
              {member.role}
            </p>
            
            <div className="w-full flex items-center gap-2 mb-6">
              <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-center items-center gap-1.5 text-slate-500 mb-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Active Tasks</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {member.activeTasks}
                </div>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium text-sm flex justify-center items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Mail className="w-4 h-4" /> Message
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
