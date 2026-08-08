import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminTeamClient, TeamMemberItem } from '@/components/admin/team/admin-team-client'
import { getTranslations } from 'next-intl/server'

export default async function AdminTeamPage() {
  await requireRole(["ADMIN"])
  const t = await getTranslations('AdminTeam')

  // Fetch real team members from database with active projects and active tasks
  const dbTeamMembers = await prisma.user.findMany({
    where: { role: 'TEAM_MEMBER' },
    include: {
      workerProjects: {
        where: { status: { notIn: ['COMPLETED', 'CANCELLED'] } },
        select: { id: true, title: true, status: true },
      },
      tasks: {
        where: { status: { not: 'DONE' } },
        include: { project: { select: { title: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  }).catch(() => [])

  const initialTeam: TeamMemberItem[] = dbTeamMembers.map((user) => {
    const activeProjectsCount = user.workerProjects?.length || 0
    const activeTasksCount = user.tasks?.length || 0
    const totalWorkload = activeProjectsCount + activeTasksCount

    let status: 'Available' | 'Busy' | 'Away' = 'Available'
    if (totalWorkload >= 4) {
      status = 'Busy'
    } else if (totalWorkload >= 2) {
      status = 'Busy'
    } else {
      status = 'Available'
    }

    const projectTaskList = (user.workerProjects || []).map((p) => ({
      id: p.id,
      title: `Proyek: ${p.title}`,
      projectTitle: p.title,
      status: p.status,
      deadline: null,
    }))

    const standaloneTaskList = (user.tasks || []).map((t) => ({
      id: t.id,
      title: t.title,
      projectTitle: t.project?.title || 'Generik',
      status: t.status,
      deadline: t.deadline ? t.deadline.toISOString() : null,
    }))

    return {
      id: user.id,
      name: user.name || 'Unnamed Worker',
      email: user.email,
      phone: user.phone,
      role: user.category || 'Developer',
      status,
      activeTasks: totalWorkload,
      maxCapacity: 5,
      skills: user.skills || [],
      category: user.category,
      rating: user.rating || 5.0,
      totalReviews: user.totalReviews || 0,
      image: user.image,
      tasksList: [...projectTaskList, ...standaloneTaskList],
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


