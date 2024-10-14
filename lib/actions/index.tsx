"use server";

import { User } from "@prisma/client";
import { getVerificationTokenByToken } from "./verificationToken";
import { prisma } from "../db";

const VerifyToken = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  // console.log('🚀 ~ VerifyToken ~ existingToken:', existingToken)
  if (!existingToken) {
    return { message: "Token does not exist", status: 404 };
  }
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { message: "Token expired", status: 401 };
  }
  const existingUser = await getUserByEmail(existingToken.email);
  // console.log('🚀 ~ VerifyToken ~ existingUser:', existingUser)
  if (!existingUser) {
    return { message: "Email does not exist", status: 400 };
  }
  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      verified: new Date(),
      email: existingToken.email,
    },
  });
  await prisma.verificationToken.delete({
    where: { id: existingToken.id },
  });
  return {
    email: existingToken.email,
    message: "Email Verified. Please login now",
    status: 201,
  };
};

export default VerifyToken;

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
