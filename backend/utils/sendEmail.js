// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const mailOptions = {
    from: `"ScanBar App" <noreply@scanbar.com>`, // Alamat 'from' ini bisa apa saja untuk Mailtrap
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);

  console.log('--- EMAIL DIKIRIM KE MAILTRAP ---');
  console.log('Cek inbox Mailtrap Anda di https://mailtrap.io/');
  console.log('---------------------------------');
};

module.exports = sendEmail;