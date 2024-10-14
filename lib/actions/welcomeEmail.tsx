import { getVerificationTokenByEmail } from "./verificationToken";
import { prisma } from "../db";
import { Resend } from "resend";
import MagicLinkEmail from "@/react-email-starter/emails/MagicLinkEmail";
import { WelcomeEmail } from "@/react-email-starter/emails/stripe-welcome";

// Generate a 4-digit OTP
const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const sendOtpVerification = async (email: string) => {
  const token = generateOtp();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getVerificationTokenByEmail(email);
  console.log("EXISTING TOKEN", existingToken);
  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken?.id,
      },
    });
  }
  const verificationToken = await prisma.otpVerification.create({
    data: {
      email,
      otp: token,
      expires,
    },
  });

  await sendVerificationEmail(email, token);

  return verificationToken;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = token; // Construct the verification URL

  try {
    const { data, error } = await resend.emails.send({
      from: `Acme <${process.env.EMAIL_FROM}>`,
      to: [email], // `to` must be in an array
      subject: "Verify Your Account",
      react: MagicLinkEmail({ loginLink: verificationLink }), // Pass the firstName to your EmailTemplate
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send verification email");
    }

    return data;
  } catch (error) {
    console.error("Error in sendVerificationEmail:", error);
    throw error;
  }
};

export const sendCongratsEmail = async (email: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `Acme <${process.env.EMAIL_FROM}>`,
      to: [email], // `to` must be in an array
      subject: "Verify Your Account",
      react: WelcomeEmail({ message: email }), // Pass the firstName to your EmailTemplate
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send verification email");
    }

    return data;
  } catch (error) {
    console.error("Error in sendVerificationEmail:", error);
    throw error;
  }
};
