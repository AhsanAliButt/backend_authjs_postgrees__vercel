import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { generateVerificationToken } from "@/lib/tokens";
import sendOtpVerficationEmail from "@/lib/sendOtp";
// import sendOtpVerficationEmail from "@/lib/sendOtp";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    await db.$connect();
    const body = await req.json();
    const { firstname, lastname, email, password } = body;
    console.log("[SIGNUP_USER]", { body });
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }
    if (!password) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email Already Exists" },
        { status: 409 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashedPassword,
        role: UserRole.CONSUMER,
      },
    });
    console.log("NEW USER CREATED", newUser);
    const verificationToken = await generateVerificationToken(newUser.email);
    const sendOtpResponse = await sendOtpVerficationEmail(
      verificationToken.email,
      verificationToken.token
    );
    console.log("SEND USER verifaction email status", sendOtpResponse.message);
    return NextResponse.json(
      { user: newUser, message: "Verification email sent" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[SIGNUP_USER_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  } finally {
    await db.$disconnect();
  }
}
