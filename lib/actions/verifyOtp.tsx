"use server";
import { cookies } from "next/headers";
import { User } from "@prisma/client";
import { getVerificationByOtp } from "./verificationToken";
import { prisma } from "../db";
import { verifyJWT } from "./jwtHelper";

const VerifyOtpCode = async (otp: string) => {
    const token = cookies().get("temp_auth_token");
  if (!token) {
    return { message: "Access Token does not exist", status: 404 };
  }

const decoded = await verifyJWT(token?.value || "");
    const storedEmail = decoded.email;
    const storedPassword = decoded.password;

    if (!storedEmail || !storedPassword) {
      return {message: "Email Not Found",  status: 403 };
    }
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
  const user = await prisma.user.findUnique({
    where: { email: existingToken.email },
  });
  await prisma.otpVerification.delete({
    where: { id: existingToken.id },
  });
  if (!user) {
    return { message: "User not found", status: 404 };
  }
  deleteAuthToken();
  return {
    email: user.email || "",
    password:storedPassword,
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


const deleteAuthToken = () => {
  cookies().set("temp_auth_token", "", { expires: new Date(0) });
};