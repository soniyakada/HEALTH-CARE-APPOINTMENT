import nodemailer from "nodemailer";


export const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: "soniyakada123@gmail.com",
    pass: "phzg amsl arrq mzhq",
  },
});
