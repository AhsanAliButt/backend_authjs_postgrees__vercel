import { User, UserRole } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
declare module "next-auth" {
  interface Session {
    user: User;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user: User;
    accessToken?: string;
    role: UserRole;
  }
}

type VerificationToken = {
  id: string;
  email: string;
  token: string;
  expires: Date;
};
