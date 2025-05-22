import { NextResponse, NextRequest } from "next/server";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
import { dbConfig } from "@/db_config/dbConfig";

dbConfig();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;
    console.log(reqBody);

    // validate user
    if (!email) {
      console.log("Forgot password API: Email not provided.");
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("Forgot password API: User not found.");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // generate reset token
    const resetToken = await bcrypt.hash(email, 10);
    console.log("Forgot password API: Reset token generated.");

    // update user
    user.forgotPasswordToken = resetToken;
    user.forgotPasswordTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();
    console.log("Forgot password API: User updated.");

    // send email
    await sendEmail({
      email: user.email,
      emailType: "RESET",
      userId: user._id,
    });
    console.log("Forgot password API: Password reset email sent.");

    return NextResponse.json(
      {
        message:
          "If an account with that email exists, a password reset link has been sent to your inbox.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
