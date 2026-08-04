import { NextResponse } from 'next/server'
import { processAutoHoldProjects, processAutoApproveDeliverables } from '@/lib/edge-cases'

export async function GET() {
  try {
    const autoHeldCount = await processAutoHoldProjects()
    const autoApprovedCount = await processAutoApproveDeliverables()

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        projectsAutoHeld: autoHeldCount,
        deliverablesAutoApproved: autoApprovedCount,
      }
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
