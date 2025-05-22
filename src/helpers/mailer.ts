import nodemailer from "nodemailer";
import User from "@/models/userModel"; // Ensure this path is correct
import bcryptjs from "bcryptjs"; // Use bcryptjs for consistency

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    console.log("sendEmail: Function started.");
    console.log(
      "sendEmail: Received emailType:",
      emailType,
      "and userId:",
      userId
    );

    // Ensure userId is valid before proceeding
    if (!userId) {
      console.error("sendEmail: userId is undefined or null.");
      throw new Error("User ID is required to send email.");
    }

    // Create a hashed token from userId
    console.log("sendEmail: Hashing token from userId.");
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    console.log("sendEmail: Hashed token created successfully.");

    // Update user with token and expiry based on emailType
    if (emailType === "VERIFY") {
      console.log("sendEmail: Updating user for VERIFY email type.");
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour expiry
      });
      console.log("sendEmail: User updated with verification token.");
    } else if (emailType === "RESET") {
      console.log("sendEmail: Updating user for RESET email type.");
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour expiry
      });
      console.log("sendEmail: User updated with reset password token.");
    } else {
      console.warn("sendEmail: Unknown emailType provided:", emailType);
      // Consider throwing an error here if unknown types are not allowed
    }

    // Nodemailer transporter setup
    console.log("sendEmail: Setting up Nodemailer transporter.");

    // console.log("sendEmail: MAILTRAP_HOST:", process.env.MAILTRAP_HOST);
    // console.log("sendEmail: MAILTRAP_PORT:", process.env.MAILTRAP_PORT);
    console.log("sendEmail: MAILTRAP_USER:", process.env.MAILTRAP_USER);
    console.log("sendEmail: MAILTRAP_PASS:", process.env.MAILTRAP_PASSWORD); // Be careful with logging sensitive info in production
    console.log("sendEmail: DOMAIN:", process.env.DOMAIN);
    // console.log("sendEmail: SENDER_EMAIL:", process.env.SENDER_EMAIL);

    // Make sure these are set in your .env.local file:
    // MAILTRAP_HOST=sandbox.smtp.mailtrap.io
    // MAILTRAP_PORT=2525
    // MAILTRAP_USER=your_mailtrap_username
    // MAILTRAP_PASS=your_mailtrap_password
    // DOMAIN=http://localhost:3000 (or your deployed domain)
    // SENDER_EMAIL=your_sender_email@example.com

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: parseInt("2525"), // Ensure port is number
      auth: {
        user: process.env.MAILTRAP_USER || "36a4d16894NSK242Ds78", // Fallback for dev, but use .env
        pass: process.env.MAILTRAP_PASSWORD || "6584afdaDaf", // Fallback for dev, but use .env
      },
      // secure: true, // Use 'true' if using port 465 (SSL/TLS)
      // tls: {
      //   rejectUnauthorized: false // Only for development with self-signed certs, remove in production
      // }
    });
    console.log("sendEmail: Nodemailer transporter created.");

    const linkPath = emailType === "VERIFY" ? "/verifyemail" : "/resetpassword";
    const actionText =
      emailType === "VERIFY" ? "verify your email" : "reset your password";

    // Construct email options
    console.log("sendEmail: Constructing mail options.");
    const mailOptions = {
      from: "patelkalp614@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${
        process.env.DOMAIN || "http://localhost:3000" // Fallback if DOMAIN is not set
      }${linkPath}?token=${hashedToken}">here</a> to ${actionText} or copy and paste the link below. <br>${
        process.env.DOMAIN || "http://localhost:3000" // Fallback if DOMAIN is not set
      }${linkPath}?token=${hashedToken}</p>`,
    };
    console.log("sendEmail: Mail options constructed.");

    // Send the email
    console.log("sendEmail: Attempting to send email...");
    const mailResponse = await transporter.sendMail(mailOptions);
    console.log(
      "sendEmail: Email sent successfully. Message ID:",
      mailResponse.messageId
    );
    return mailResponse;
  } catch (error: any) {
    // Log the detailed error for debugging purposes
    console.error("sendEmail: Error during email process:", error);
    // Re-throw the error so the calling function (signup/route.ts) can catch it
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
