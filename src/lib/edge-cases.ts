import { prisma } from '@/lib/db'

/**
 * Auto-Hold Project Check:
 * Sets project status to 'ON_HOLD' if client has not interacted / responded for > 3 days
 * during IN_PROGRESS or WORKER_REVIEW status.
 */
export async function processAutoHoldProjects() {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)

  // Find active projects where client hasn't sent a message or updated in > 3 days
  const inactiveProjects = await prisma.project.findMany({
    where: {
      status: { in: ['IN_PROGRESS', 'WORKER_REVIEW'] },
      updatedAt: { lt: threeDaysAgo },
    }
  })

  let count = 0
  for (const project of inactiveProjects) {
    // Check last client message timestamp
    const lastClientMessage = await prisma.message.findFirst({
      where: {
        projectId: project.id,
        sender: { role: 'CLIENT' }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!lastClientMessage || lastClientMessage.createdAt < threeDaysAgo) {
      await prisma.project.update({
        where: { id: project.id },
        data: {
          status: 'ON_HOLD',
          clientFeedback: `System Auto-Hold: Client inactive for > 3 days.`
        }
      })
      count++
    }
  }

  return count
}

/**
 * Auto-Approve Deliverables Check:
 * Automatically approves deliverables with PENDING_REVIEW status after > 14 work days
 */
export async function processAutoApproveDeliverables() {
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)

  const pendingDeliverables = await prisma.deliverable.findMany({
    where: {
      status: 'PENDING_REVIEW',
      createdAt: { lt: fourteenDaysAgo }
    }
  })

  let count = 0
  for (const item of pendingDeliverables) {
    await prisma.deliverable.update({
      where: { id: item.id },
      data: {
        status: 'APPROVED',
        description: `${item.description || ''} [Auto-Approved by System after 14 days inactivity]`
      }
    })
    count++
  }

  return count
}
