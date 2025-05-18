import { transporter } from "../utils/emailSetup.js";

export const sendconfirmation = async (email, status ,name ,doctorname) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || "gmail",
    to: email,
    subject: "Your Verification Code for Healthcare App",
    html: `
      <div style="font-family: Arial;">
        <h2>Appointment Status</h2>
        <p> Dear ${name} Your appointment has been:</p>
        <h1>${status.toUpperCase()} with Dr. ${doctorname}</h1>
        <p>Thank you for using our service.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};


// Send OTP Email
export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || "gmail",
    to: email,
    subject: "Your Verification Code for Healthcare App",
    html: `
      <div style="font-family: Arial;">
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
