import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("API HITTED GET USER");
  try {
    await prisma.$connect();

    const users = await prisma.user.findMany();
    console.log("USERS", users);
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("[GET_ALL_USERS_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
