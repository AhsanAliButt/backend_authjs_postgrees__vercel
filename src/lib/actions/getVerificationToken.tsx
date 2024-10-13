import { v4 as uuidv4 } from "uuid";
import { getVerificationTokenByEmail } from "./verificationToken";
import { prisma } from "../db";
import { Resend } from "resend";
import MagicLinkEmail from "../../../react-email-starter/emails/notion-magic-link";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4().toString();
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
  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  await sendVerificationEmail(email, token);

  return verificationToken;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${process.env.VERCEL_URL}/verify-user?token=${token}`; // Construct the verification URL

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
