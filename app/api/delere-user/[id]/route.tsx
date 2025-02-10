import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.$connect();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (existingUser.role === "ADMIN") {
      return NextResponse.json(
        { message: "Admins cannot be deleted" },
        { status: 403 }
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json(
      { message: "User Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
