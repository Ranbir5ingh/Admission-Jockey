const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'user@example.com',
    pass: process.env.SMTP_PASS || 'password',
  },
});

exports.sendVerificationEmail = async (to, token) => {
  const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${token}`;
  const mailOptions = {
    from: process.env.SMTP_FROM || 'no-reply@example.com',
    to,
    subject: 'Verify your email',
    text: `Please verify your email by clicking the following link: ${url}`,
    html: `<p>Please verify your email by clicking the following link: <a href="${url}">${url}</a></p>`,
  };
  await transporter.sendMail(mailOptions);
};

exports.sendResetPasswordEmail = async (to, token) => {
  const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;
  const mailOptions = {
    from: process.env.SMTP_FROM || 'no-reply@example.com',
    to,
    subject: 'Reset your password',
    text: `You can reset your password by clicking the following link: ${url}`,
    html: `<p>You can reset your password by clicking the following link: <a href="${url}">${url}</a></p>`,
  };
  await transporter.sendMail(mailOptions);
};
