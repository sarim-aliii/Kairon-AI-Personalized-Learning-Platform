import nodemailer from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  // 1. Create a Transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define Email Options
  const mailOptions = {
    from: `Kairon AI <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    // Send as both plain text and HTML (converting newlines to <br> for HTML)
    text: options.message,
    html: options.message.replace(/\n/g, '<br>'),
  };

  // 3. Send Email
  await transporter.sendMail(mailOptions);
};