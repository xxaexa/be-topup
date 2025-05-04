import nodemailer from 'nodemailer';

export const sendToMail = async (
  email: string,
  subject: string,
  html: string
): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user:process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email berhasil dikirim ke ${email}`);
  } catch (error) {
    console.error('Gagal mengirim email:', error);
    throw new Error('Email gagal dikirim');
  }
};
