"use server";

import { User } from "@prisma/client";
import { getVerificationByOtp } from "./verificationToken";
import { prisma } from "../db";

const VerifyOtpCode = async (otp: string) => {
  const existingToken = await getVerificationByOtp(otp);
  
  if (!existingToken) {
    return { message: "Token does not exist", status: 404 };
  }
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { message: "Token expired", status: 401 };
  }
  const existingUser = await getUserByEmail(existingToken.email);
  
  if (!existingUser) {
    return { message: "Email does not exist", status: 400 };
  }
  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      isAccess: true,
      email: existingToken.email,
    },
  });
  await prisma.otpVerification.delete({
    where: { id: existingToken.id },
  });
  return {
    email: existingToken.email,
    message: "your otp verified",
    status: 201,
  };
};

export default VerifyOtpCode;

const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};
