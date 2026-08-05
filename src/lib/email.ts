import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

/**
 * Helper to send email via Resend
 */
export async function sendEmailNotification({ to, subject, html, text }: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Skipping email send.");
    return null;
  }

  try {
    const data = await resend.emails.send({
      from: 'Crave Platform <noreply@crave.com>', // Replace with your verified domain
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, ''), // Basic fallback text
    });

    return data;
  } catch (error) {
    console.error("Failed to send email notification:", error);
    return null;
  }
}
