import sgMail from "@sendgrid/mail";

// Safely retrieve the API key, or throw an error if it's missing
const sendGridApiKey = process.env.SENDGRID_API_KEY;
if (!sendGridApiKey) {
  throw new Error(
    "SENDGRID_API_KEY is not defined in the environment variables"
  );
}

sgMail.setApiKey(sendGridApiKey);

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const fromEmail = process.env.EMAIL_USER;

  const msg = {
    from: fromEmail as string,
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>💡 <strong>Forgot Your Password?</strong></p>
        <p>If you requested a password reset, click the link below to reset your password:</p>
        <p><a href="${resetLink}" style="color: #3498db;">Reset Password</a></p>
        <p>If you didn’t request this, please ignore this email, and your password will remain unchanged.</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error: any) {
    throw new Error("Could not send password reset email");
  }
};
