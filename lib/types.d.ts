import { User, UserRole } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
declare module "next-auth" {
  interface Session {
    user: User;
    accessToken?: string;
  }
}

// declare module "next-auth" {
//   /**
//    * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
//    */
//   interface Session {
//     user: {
//       id: string;
//       username: string;
//       role: UserRole;
//       email: string;
//     } & DefaultSession["user"];
//   }

//   interface User extends DefaultUser {
//     id: string;
//     username: string;
//     role: UserRole;
//   }
// }
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user: User;
    accessToken?: string;
    role: UserRole;
  }
}

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       username: string;
//       email: string;
//       role: UserRole;
//       verified: boolean;
//       createdAt: Date;
//       updatedAt: Date;
//     } & DefaultSession["user"];
//   }

//   interface User extends DefaultUser {
//     id: string;
//     username: string;
//     role: UserRole;
//     verified: boolean;
//     createdAt: Date;
//     updatedAt: Date;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT extends DefaultJWT {
//     user: {
//       id: string;
//       username: string;
//       email: string;
//       role: UserRole;
//       verified: boolean;
//       createdAt: Date;
//       updatedAt: Date;
//     };
//     role: UserRole;
//   }
// }

// type User = {
//   id: string;
//   email: string;
//   username: string;
//   role: UserRole;
//   verified: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// };

type VerificationToken = {
  id: string;
  email: string;
  token: string;
  expires: Date;
};
