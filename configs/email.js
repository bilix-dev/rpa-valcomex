import nodemailer from "nodemailer";

const smtpOptions = {
  host: process.env.SMTP_SERVER,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_ADDRESS,
    pass: process.env.SMTP_PASSWORD,
  },
};

export const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    ...smtpOptions,
  });

  return await transporter.sendMail({
    from: `${process.env.SMTP_USER} <${process.env.SMTP_ADDRESS}>`,
    ...data,
  });
};
