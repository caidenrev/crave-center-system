"use server";

import { prisma } from "@/lib/db";
import { createSnapTransaction } from "@/lib/midtrans";
import { createClient } from "@/utils/supabase/server";
import { PaymentType } from "@/generated/prisma";

export async function initiatePayment(projectId: string, amount: number, paymentType: PaymentType) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    throw new Error("Unauthorized");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email }
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // Create payment record in DB first
  const payment = await prisma.payment.create({
    data: {
      projectId,
      amount,
      type: paymentType,
      status: "PENDING"
    }
  });

  // Call Midtrans Snap API
  const transaction = await createSnapTransaction(
    payment.id,
    amount,
    {
      first_name: dbUser.name,
      email: dbUser.email,
      phone: dbUser.phone || undefined
    },
    [
      {
        id: projectId.substring(0, 10), // Midtrans max item id length might be restricted, keep it short
        name: `Payment for ${project.title} (${paymentType})`,
        price: amount,
        quantity: 1
      }
    ]
  );

  if (transaction && transaction.token) {
    // Save token in DB for later retrieval (if needed)
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        snapToken: transaction.token,
        snapRedirectUrl: transaction.redirect_url
      }
    });

    return {
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
      paymentId: payment.id
    };
  }

  throw new Error("Failed to get Snap Token from Midtrans");
}
