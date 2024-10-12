import { prisma } from "@/lib/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials: any) {
        console.log("authorize", credentials);
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Missing credentials");
        }
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });
          if (!user) {
            throw new Error("User not found");
          }
          // if (!user.verified) {
          //   await generateVerificationToken(user.email);
          //   throw new Error("Verification Email sent... Please Verify");
          // }

          const userPassword = user.password;

          const isPasswordValid = bcrypt.compareSync(
            credentials.password as string,
            userPassword
          );

          if (!isPasswordValid) {
            throw new Error("Incorrect password");
          }

          // const users = [
          //   {
          //     id: "test-user-1",
          //     userName: "test1@gmail.com",
          //     name: "Test 1",
          //     password: "password",
          //     email: "test1@gmail.com",
          //     role: "consumers",
          //     verified: "45464545",
          //   },
          // ];

          // const user = users.find(
          //   (user) =>
          //     user.email === credentials?.email &&
          //     user.password === credentials?.password
          // );
          // if (!user) {
          //   throw new Error("No User Found");
          // }

          return {
            id: user.id,
            email: user.email,
            firstname: user.fullname,
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
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
