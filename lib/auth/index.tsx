import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../db";
import { generateVerificationToken } from "../actions/getVerificationToken";

export const BASE_PATH = "/api/auth";

const authOptions = {
  pages: {
    signIn: "/signin",
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
        await prisma.$connect();
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
            firstname: user.fullname,
            role: user.role as UserRole,
            verified: user.verified,
            // accessToken: accessToken,
          };
        } catch (error: any) {
          console.error("Auth Error", error);
          throw new Error(error); // Throw a generic error message
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      // If the user object is available, store its properties in the token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { token: any; session: any }) {
      // Attach the user ID from the token to the session object
      if (session?.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  basePath: BASE_PATH,
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth } = NextAuth(authOptions);
