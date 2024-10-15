// import { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/lib/db"; // Adjust the import based on your setup
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     await prisma.$connect();
//     const url = new URL(req.url);
//     const userId = url.searchParams.get("userId");

//     if (!userId) {
//       return new NextResponse("User id not found", { status: 500 });
//     }

//     // Check if the user exists

//     const updatedUser = await prisma.user.update({
//       where: { id: userId }, // Use the extracted userId here
//       data: { role: "ADMIN" }, // Change the role
//     });

//     return NextResponse.json(
//       { type: updatedUser.role, message: " added successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("[SELLER_INFO_ERROR]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db"; // Adjust the import based on your setup
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await prisma.$connect();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new NextResponse("User ID not provided", { status: 400 });
    }

    // Retrieve the user's current role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // If user is already an admin, return the message
    if (user.role === "ADMIN") {
      return NextResponse.json(
        {
          message:
            "You are already an admin, please sign in again to use admin features",
        },
        { status: 200 }
      );
    }

    // Update the user's role to "ADMIN"
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: "ADMIN" },
    });

    return NextResponse.json(
      { type: updatedUser.role, message: "Admin role added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[PROMOTE_ADMIN_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
