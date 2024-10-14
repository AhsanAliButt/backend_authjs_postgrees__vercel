import { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { User, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { prisma } from "./db";
import { generateVerificationToken } from "./actions/getVerificationToken";
import { sendOtpVerification } from "./actions/otpServices";
import { sendCongratsEmail } from "./actions/welcomeEmail";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { verified: new Date() },
      });
    },
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {},
        password: {},
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials: any) {
        console.log("authorize", credentials);
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Missing credentials");
        }
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (!user) {
            throw new Error("User not found");
          }
          if (!user.verified) {
            await generateVerificationToken(user.email);
            throw new Error("Verification Email sent... Please Verify");
          }
          if (user.isAccess === false) {
            await sendOtpVerification(user.email);
            throw new Error("OTP sent. Please check your email.");
          }
          if (user.congratsEmailSent === false) {
            await sendCongratsEmail(user.email);
          }

          const userPassword = user.password;

          const isPasswordValid = bcrypt.compareSync(
            credentials.password,
            userPassword
          );

          if (!isPasswordValid) {
            throw new Error("Incorrect password");
          }

          return {
            id: user.id,
            email: user.email,
            fullname: user.fullname,
            role: user.role as UserRole,
            verified: user.verified,
          };
        } catch (error: any) {
          console.error("Auth Error", error);
          throw new Error(error); // Throw a generic error message
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // console.log("Account", account);
      if (user && account) {
        token.user = user as User;
        token.accessToken = account.access_token;
        // console.log("Account access token:", account.access_token); // Check if this logs correctly
      }
      if (trigger === "update" && session) {
        token = { ...token, user: session?.user };
        return token;
      }
      return token;
    },
    async session({ token, session }) {
      // console.log("token>>>>", token, "session>>>>", session);
      if (session?.user) {
        session.user = token.user;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
} satisfies NextAuthOptions;

export const getAuthSession = () => getServerSession(authOptions);
