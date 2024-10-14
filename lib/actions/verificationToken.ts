import { prisma } from "../db";

type VerificationToken = {
  id: string;
  email: string;
  token: string;
  expires: Date;
};
export const getVerificationTokenByEmail = async (
  email: string
): Promise<VerificationToken | null> => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { email },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};
export const getVerificationTokenByToken = async (
  token: string
): Promise<VerificationToken | null> => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationByOtp = async (otp: string) => {
  try {
    const verificationToken = await prisma.otpVerification.findUnique({
      where: { otp: otp }, // Search by OTP, not token
    });
    return verificationToken;
  } catch (error) {
    console.error("Error fetching verification token:", error);
    return null;
  }
};
