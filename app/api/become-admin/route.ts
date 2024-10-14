import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db"; // Adjust the import based on your setup
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await prisma.$connect();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new NextResponse("Internal error", { status: 500 });
    }

    // Check if the user exists

    const updatedUser = await prisma.user.update({
      where: { id: userId }, // Use the extracted userId here
      data: { role: "ADMIN" }, // Change the role
    });

    return NextResponse.json(
      { type: updatedUser.role, message: " added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[SELLER_INFO_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
