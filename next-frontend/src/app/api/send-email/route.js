import { NextResponse } from 'next/server';
import createEmailService from '@/lib/emailService';

export async function POST(req) {
  try {
    const body = await req.json();
    const { recipients, emailTemplate } = body;
    console.log(recipients)
    // Validate input
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: 'Invalid recipients' }, { status: 400 });
    }

    // Create email service
    const emailService = createEmailService();

    // Custom email template function
    const generateEmailContent = (recipient) => ({
      subject: `Payment Confirmation for ${recipient.name}`,
      htmlContent: `
        <h1>Payment Confirmation</h1>
        <p>Dear ${recipient.name},</p>
        <p>Your payment of $${recipient.amount} has been processed successfully.</p>
        <p>Team: ${recipient.team_name}</p>
        <p>Wallet Address: ${recipient.wallet_addr}</p>
        <p>Thank you!</p>
      `,
    });

    // Send emails
    const results = await emailService.sendEmails(recipients, generateEmailContent);

    // Check if all emails were sent successfully
    const failedEmails = results.filter((result) => result === null);

    if (failedEmails.length > 0) {
      return NextResponse.json({
        error: 'Some emails failed to send',
        failedCount: failedEmails.length,
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Emails sent successfully',
      sentCount: recipients.length,
    }, { status: 200 });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
