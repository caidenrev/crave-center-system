import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id: deliverableId } = await props.params

    const deliverable = await prisma.deliverable.findUnique({
      where: { id: deliverableId },
      include: {
        project: {
          include: {
            payments: true,
            terms: true,
          }
        }
      }
    })

    if (!deliverable) {
      return NextResponse.json({ error: "Deliverable file not found" }, { status: 404 })
    }

    const project = deliverable.project
    const totalPaid = project.payments
      .filter((p: any) => p.status === 'SUCCESS')
      .reduce((sum: number, p: any) => sum + Number(p.amount), 0)

    const finalPrice = project.terms?.priceFinal ? Number(project.terms.priceFinal) : 0

    // Gatekeeper Enforcement: If total paid < final price (and final price > 0), reject!
    const isFullyPaid = finalPrice > 0 ? totalPaid >= finalPrice : true

    if (!isFullyPaid) {
      return NextResponse.json(
        {
          error: "Akses Unduhan Ditahan (Gatekeeper File Final). Proyek belum dilunasi 100%.",
          requiredAmount: finalPrice,
          currentPaid: totalPaid,
        },
        { status: 403 }
      )
    }

    // Redirect to the actual file URL
    return NextResponse.redirect(deliverable.fileUrl)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
