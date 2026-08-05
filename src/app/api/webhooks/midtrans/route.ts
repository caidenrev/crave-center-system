import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type
    } = body;

    // Verify signature to ensure the request is actually from Midtrans
    const serverKey = process.env.MIDTRANS_SERVER_KEY || 'dummy_server_key';
    const hash = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex');

    if (hash !== signature_key) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });
    }

    // Determine our internal payment status based on Midtrans transaction_status
    let internalStatus: 'PENDING' | 'SUCCESS' | 'FAILED' = 'PENDING';

    if (transaction_status === 'capture') {
      if (fraud_status === 'challenge') {
        // Wait for manual review
        internalStatus = 'PENDING';
      } else if (fraud_status === 'accept') {
        internalStatus = 'SUCCESS';
      }
    } else if (transaction_status === 'settlement') {
      internalStatus = 'SUCCESS';
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      internalStatus = 'FAILED';
    } else if (transaction_status === 'pending') {
      internalStatus = 'PENDING';
    }

    // Update payment record
    const updatedPayment = await prisma.payment.update({
      where: { id: order_id },
      data: {
        status: internalStatus,
        paymentMethod: payment_type,
        paidAt: internalStatus === 'SUCCESS' ? new Date() : null
      }
    });

    // If payment is SUCCESS, we can trigger additional business logic here
    // For example, update Project status from PENDING_DP to IN_PROGRESS
    if (internalStatus === 'SUCCESS' && updatedPayment.type === 'DP') {
      const project = await prisma.project.update({
        where: { id: updatedPayment.projectId },
        data: { status: 'IN_PROGRESS' }
      });

      if (project.workerId) {
        const { createNotification } = await import("@/app/actions/notification");
        await createNotification({
          userId: project.workerId,
          title: "DP Received & Project Started!",
          message: `Client has paid DP for "${project.title}". You can start working now.`,
          type: "SUCCESS",
          link: "/id/worker/projects"
        });
      }
    }

    return NextResponse.json({ message: 'OK' });
  } catch (error) {
    console.error('Midtrans Webhook Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
