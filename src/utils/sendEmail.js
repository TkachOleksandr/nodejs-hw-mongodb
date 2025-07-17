import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

// Витягуємо змінні з .env
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;

// Для перевірки, чи підвантажилось коректно
console.log("SMTP_HOST:", SMTP_HOST);
console.log("SMTP_USER:", SMTP_USER);

// Створюємо транспортер
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465, // true для порту 465, інакше false
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // дозволяє використовувати самопідписані сертифікати
  },
  logger: true, // виводить логи у консоль
  debug: true,  // включає детальний лог для налагодження
});

// Основна функція відправки
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html,
    });
    console.log('✅ Email sent successfully:', info);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
};