import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { generateVerificationToken } from "@/lib/actions/getVerificationToken";

// import sendOtpVerficationEmail from "@/lib/sendOtp";

export async function POST(req: Request) {
  try {
    await prisma.$connect();
    const body = await req.json();
    const { firstname, lastname, email, password } = body;
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
        fullname: firstname,
        email: email,
        password: hashedPassword,
      },
    });
    const generateTokenAndSendEmail = await generateVerificationToken(
      newUser.email
    );

    console.log("generateToken", generateTokenAndSendEmail);
    return NextResponse.json(
      { user: newUser, message: "Verification email sent" },
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
