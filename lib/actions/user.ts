"use server";

import { getSession } from "next-auth/react";
import { prisma } from "../db";
import { signIn } from "next-auth/react";

export const register = async (values: any) => {
  const response = await fetch(`/api/auth/signup`, {
    method: "POST",
    body: JSON.stringify({
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      password: values.password,
      username: values.username,
    }),
  });
  return response;
};

export async function authenticate(values: {
  email: string;
  password: string;
}) {
  console.log("Values", values);
  try {
    const response = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false, // Don't redirect automatically
    });

    console.log("Response in Server Action", response);

    // Check if signIn was successful
    if (response?.error) {
      return {
        error: { message: response.error },
      };
    }

    // If successful
    return { success: true, message: "Login successful" };
  } catch (err: any) {
    // Handle unexpected errors
    console.error("Error during sign in", err);
    return { error: { message: "Failed to login", error: err.message || err } };
  }
}

export async function getVerificationTime() {
  try {
    // Get the current user's session
    const session = await getSession();
    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    // Fetch the user's verification time from the database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return { success: true, user };
  } catch (error) {
    return { error: { message: error } };
  }
}
