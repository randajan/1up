import nodemailer from "nodemailer";
import env from "@randajan/simple-app/env";
import log from "@randajan/simple-app/log";
import { buildNotificationEmail } from "./builder";

const { config, defs } = env.nodemailer;

let transporter;
const getTransporter = () => {
  if (transporter) { return transporter; }
  transporter = nodemailer.createTransport(config, defs);
  return transporter;
};

export const sendMail = async ({ to, subject, html }) => {
  log("SEND", to, subject);
  return getTransporter().sendMail({
    to,
    subject,
    html,
  });
};

export const sendNotification = async (redirect, accs)=>{
  const n = await buildNotificationEmail(redirect, accs);

  if (n) { return sendMail(n); }

}
