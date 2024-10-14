"use client";
import { SessionProvider } from "next-auth/react";

export default function NextAuthProvider({ children }: { children: any }) {
  return <SessionProvider>{children}</SessionProvider>;
}
