import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminTeamClient, TeamMemberItem } from '@/components/admin/team/admin-team-client'
import { getTranslations } from 'next-intl/server'

export default async function AdminTeamPage() {
  await requireRole(["ADMIN"])
  const t = await getTranslations('AdminTeam')

  // Fetch real team members from database with active tasks and project details
  const dbTeamMembers = await prisma.user.findMany({
    where: { role: 'TEAM_MEMBER' },
    include: {
      tasks: {
        where: { status: { not: 'DONE' } },
        include: { project: { select: { title: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  }).catch(() => [])

  const initialTeam: TeamMemberItem[] = dbTeamMembers.map((user) => {
    const activeTasksCount = user.tasks?.length || 0
    let status: 'Available' | 'Busy' | 'Away' = 'Available'
    if (activeTasksCount >= 4) status = 'Busy'

    return {
      id: user.id,
      name: user.name || 'Unnamed Worker',
      email: user.email,
      phone: user.phone,
      role: user.category || 'Developer',
      status,
      activeTasks: activeTasksCount,
      maxCapacity: 5,
      skills: user.skills || [],
      category: user.category,
      rating: user.rating || 5.0,
      totalReviews: user.totalReviews || 0,
      image: user.image,
      tasksList: (user.tasks || []).map((t) => ({
        id: t.id,
        title: t.title,
        projectTitle: t.project?.title || 'Generik',
        status: t.status,
        deadline: t.deadline ? t.deadline.toISOString() : null,
      })),
    }
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t('title')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t('subtitle')}</p>
      </div>

      <AdminTeamClient initialTeam={initialTeam} />
    </div>
  )
}


