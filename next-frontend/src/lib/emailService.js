import nodemailer from 'nodemailer';

const createEmailService = () => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const sendEmails = async (recipients, emailTemplate) => {
    const sendPromises = recipients.map(async (recipient) => {
      try {
        const emailConfig = emailTemplate(recipient);

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: recipient.email,
          subject: emailConfig.subject,
          html: emailConfig.htmlContent,
        };

        return transporter.sendMail(mailOptions);
      } catch (error) {
        console.error(`Failed to send email to ${recipient.email}:`, error);
        return null;
      }
    });

    return Promise.all(sendPromises);
  };

  return {
    sendEmails,
  };
};

export default createEmailService;
