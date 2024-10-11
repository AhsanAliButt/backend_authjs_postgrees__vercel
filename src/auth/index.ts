import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const BASE_PATH = "/api/auth";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        const users = [
          {
            id: "test-user-1",
            userName: "test1",
            name: "Test 1",
            password: "pass",
            email: "test1@donotreply.com",
          },
          {
            id: "test-user-2",
            userName: "test2",
            name: "Test 2",
            password: "pass",
            email: "test2@donotreply.com",
          },
        ];

        // Find user with matching credentials
        const user = users.find(
          (user) =>
            user.userName === credentials?.username &&
            user.password === credentials?.password
        );

        // Return user object if found, else null
        return user
          ? { id: user.id, name: user.name, email: user.email }
          : null;
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

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
