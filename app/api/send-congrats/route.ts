import { prisma } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { subHours } from "date-fns"; // You can use date-fns for manipulating dates
import { NextResponse } from "next/server";
import { sendCongratsEmail } from "@/lib/actions/welcomeEmail";

// The actual API route handler
export async function POST(req: Request) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Fetch all users from the database
    const oneHourAgo = subHours(new Date(), 1);
    const users = await prisma.user.findMany({
      where: {
        verified: {
          lte: oneHourAgo, // emailVerified is 1 hour ago or earlier
        },
        congratsEmailSent: false, // Only users who haven't received the email yet
      },
      select: {
        email: true,
        fullname: true,
        id: true,
      },
    });

    // If no users found

    const emailPromises = users.map(async (user) => {
      await sendCongratsEmail(user.email);
      // Update the user's congratsEmail to true
      await prisma.user.update({
        where: { id: user.id },
        data: { congratsEmailSent: true },
      });
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    return NextResponse.json(
      {
        message: `Congratulations email sent to ${users.length} user(s)`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing users:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
