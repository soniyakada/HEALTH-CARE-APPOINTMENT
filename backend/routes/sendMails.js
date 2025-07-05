import { transporter } from "../utils/nodemailer.js";
import dotenv from 'dotenv';
dotenv.config(); // This should be at the very top


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

export const sendPrescriptionEmail = async ({ to, patientName, doctorName, medicines, notes }) => {
  const medList = medicines.map(
    (med, idx) =>
      `<li><strong>${idx + 1}.</strong> ${med.name} - ${med.dosage}, ${med.frequency} for ${med.duration}</li>`
  ).join('');

  const htmlContent = `
    <h2>🩺 Prescription from ${doctorName}</h2>
    <p>Dear ${patientName},</p>
    <p>Here is your prescription:</p>
    <ul>${medList}</ul>
    <p><strong>Additional Notes:</strong> ${notes || 'N/A'}</p>
    <p>Stay healthy!<br/>Your Healthcare Team</p>
  `;

  await transporter.sendMail({
    from: `"Healthcare App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Digital Prescription',
    html: htmlContent,
  });
};



// Send OTP Email
export const doctorverificationmail = async (doctor) => {
  console.log("before");
  const mailOptions = {
    from: process.env.EMAIL_USER || "gmail",
    to: doctor.email,
    subject:  "Your Doctor Account is Verified!",
    html: ` Dear Dr. ${doctor.name},\n\nCongratulations! Your account has been successfully verified by the admin.\n\nYou can now log in and access your dashboard.\n\nBest regards,\nHealthCare Team`,
  };
  console.log("After");
  return transporter.sendMail(mailOptions);
};