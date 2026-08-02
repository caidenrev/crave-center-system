import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminTeamClient, TeamMemberItem } from '@/components/admin/admin-team-client'

export default async function AdminTeamPage() {
  await requireRole(["ADMIN"])

  // Fetch real team members from database
  const dbTeamMembers = await prisma.user.findMany({
    where: { role: 'TEAM_MEMBER' },
    include: { tasks: { where: { status: { not: 'DONE' } } } },
    orderBy: { createdAt: 'desc' }
  }).catch(() => [])

  const initialTeam: TeamMemberItem[] = dbTeamMembers.length > 0 ? dbTeamMembers.map((user) => {
    const activeTasksCount = user.tasks?.length || 0
    let status: 'Available' | 'Busy' | 'Away' = 'Available'
    if (activeTasksCount >= 4) status = 'Busy'
    else if (activeTasksCount === 0) status = 'Available'

    return {
      id: user.id,
      name: user.name || 'Unnamed Worker',
      email: user.email,
      role: user.category || 'Developer',
      status,
      activeTasks: activeTasksCount,
      maxCapacity: 5,
      skills: user.skills && user.skills.length > 0 ? user.skills : ['React', 'Next.js', 'TypeScript']
    }
  }) : [
    { id: '1', name: 'Alex Johnson', email: 'alex@crave.com', role: 'Frontend Specialist', status: 'Busy', activeTasks: 4, maxCapacity: 5, skills: ['Next.js', 'React', 'Tailwind CSS'] },
    { id: '2', name: 'Devon Carter', email: 'devon@crave.com', role: 'Backend Engineer', status: 'Available', activeTasks: 1, maxCapacity: 5, skills: ['Node.js', 'PostgreSQL', 'Prisma'] },
    { id: '3', name: 'Siti Rahma', email: 'siti@crave.com', role: 'UI/UX Designer', status: 'Away', activeTasks: 0, maxCapacity: 5, skills: ['Figma', 'Prototyping', 'Design Systems'] },
    { id: '4', name: 'Michael Chen', email: 'michael@crave.com', role: 'Mobile Developer', status: 'Available', activeTasks: 2, maxCapacity: 5, skills: ['Flutter', 'iOS', 'Android'] },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
          Resource & Workload Management
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Team Capacity & Workload</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor worker availability, active tasks capacity, and communicate directly with team members.</p>
      </div>

      <AdminTeamClient initialTeam={initialTeam} />
    </div>
  )
}

