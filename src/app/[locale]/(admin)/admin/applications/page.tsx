import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { ApplicationStatus } from '@/generated/prisma'
import { ReviewButtons } from '@/components/admin/review-buttons'
import Link from 'next/link'

export default async function AdminApplicationsPage() {
  await requireRole(["ADMIN"])

  const pendingApps = await prisma.workerApplication.findMany({
    where: { status: ApplicationStatus.PENDING },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Worker Applications</h1>
        <p className="text-slate-500 dark:text-slate-400">Review and approve new team members to join Crave ITSM.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {pendingApps.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No pending applications at the moment.
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 uppercase font-semibold text-xs border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Category & Skills</th>
                <th className="px-6 py-4">Links</th>
                <th className="px-6 py-4">Date Applied</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
              {pendingApps.map((app: any) => (
                <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">{app.user.name}</div>
                    <div className="text-xs text-slate-500">{app.user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-1">
                      {app.category}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {app.skills.map((s: string) => (
                        <span key={s} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs">
                      {app.portfolioUrl && <Link href={app.portfolioUrl} target="_blank" className="text-blue-600 hover:underline">Portfolio</Link>}
                      {app.githubUrl && <Link href={app.githubUrl} target="_blank" className="text-slate-700 dark:text-slate-400 hover:underline">GitHub</Link>}
                      {app.linkedinUrl && <Link href={app.linkedinUrl} target="_blank" className="text-blue-500 hover:underline">LinkedIn</Link>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ReviewButtons applicationId={app.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
