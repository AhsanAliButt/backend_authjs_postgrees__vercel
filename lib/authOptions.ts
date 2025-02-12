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
import { signJWT } from "./actions/jwtHelper";
import { cookies } from "next/headers"; // Import for setting cookies
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
             const accesstoken = await signJWT(
            {
              email: user?.email,
              password: credentials.password,
            },
            { exp: `${process.env.JWT_EXPIRES_IN}m` }
          );
          console.log("AccessToken",accesstoken)
          // Store the token in an HTTP-only cookie
    cookies().set("temp_auth_token", accesstoken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hour
      path: "/",
    });
            await sendOtpVerification(user.email);
            throw new Error("OTP sent. Please check your email.");
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
          throw new Error(error); // Throw a generic error message
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      
      if (user && account) {
        token.user = user as User;
        token.accessToken = account.access_token;
      
      }
if (trigger === "update" && session) {
      
      // Merge existing user values with session values
      token.user = { 
        ...token.user,  // Keep existing user properties
        ...session,     // Update with session values
      };
     
        return token;
      }
      return token;
    },
    async session({ token, session }) {
      if (session?.user) {
        session.user = token.user;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
} satisfies NextAuthOptions;

export const getAuthSession = () => getServerSession(authOptions);
