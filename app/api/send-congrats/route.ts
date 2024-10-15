import { prisma } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { subHours } from "date-fns"; // You can use date-fns for manipulating dates
import { NextResponse } from "next/server";
import { sendCongratsEmail } from "@/lib/actions/welcomeEmail";

// The actual API route handler

export async function POST(req: Request) {
  try {
    await prisma.$connect();
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
    if (users.length === 0) {
      return NextResponse.json(
        { message: "No users found to welcome" },
        { status: 404 }
      );
    }
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

    return NextResponse.json({ message: "Some intel issue" }, { status: 404 });
  }
}

export async function GET(req: Request) {
  try {
    await prisma.$connect();
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
    if (users.length === 0) {
      return NextResponse.json(
        { message: "No users found to welcome" },
        { status: 404 }
      );
    }
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

    return NextResponse.json({ message: "Some intel issue" }, { status: 404 });
  }
}

export async function PUT(req: Request) {
  try {
    await prisma.$connect();
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
    if (users.length === 0) {
      return NextResponse.json(
        { message: "No users found to welcome" },
        { status: 404 }
      );
    }
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

    return NextResponse.json({ message: "Some intel issue" }, { status: 404 });
  }
}
