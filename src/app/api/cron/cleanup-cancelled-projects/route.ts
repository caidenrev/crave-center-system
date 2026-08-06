import { NextResponse } from 'next/server'
import { autoDeleteCancelledProjects } from '@/app/actions/project'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const result = await autoDeleteCancelledProjects()
    return NextResponse.json({
      success: result.success,
      message: `Auto-cleanup completed. Deleted ${result.count} expired cancelled projects.`,
      deletedCount: result.count
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
