import { requireRole } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { JobRequestWizard } from "@/components/client/job-request-wizard"
import { getTranslations } from "next-intl/server"

export default async function NewRequestPage() {
  await requireRole(["CLIENT"])
  const t = await getTranslations("JobRequestForm")
  
  const workers = await prisma.user.findMany({
    where: { role: "TEAM_MEMBER" },
    select: { id: true, name: true, category: true, skills: true, rating: true, totalReviews: true }
  })
  
  const dict = {
    title: t('title'),
    step1: t('step1'),
    step2: t('step2'),
    step3: t('step3'),
    it: t('it'),
    itDesc: t('itDesc'),
    nonIt: t('nonIt'),
    nonItDesc: t('nonItDesc'),
    continue: t('continue'),
    back: t('back'),
    submit: t('submit'),
    selectWorker: t('selectWorker'),
    projectTitle: t('projectTitle'),
    projectDesc: t('projectDesc'),
    uploadBrief: t('uploadBrief'),
    deadline: t('deadline'),
    submitting: t('submitting'),
    success: t('success'),
    noWorkers: t('noWorkers'),
    budgetLabel: t('budgetLabel'),
    dropzone: t('dropzone'),
  }

  return (
    <div className="max-w-4xl mx-auto">
       <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">{dict.title}</h1>
       <JobRequestWizard workers={workers} t={dict} />
    </div>
  )
}
