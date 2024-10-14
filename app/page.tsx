"use client";
import UsersList from "@/screens/adminTable";
import LandingPage from "@/screens/landingPage";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();

  return (
    <main>
      <div className="flex flex-col items-center w-full">
        <LandingPage />
      </div>
    </main>
  );
}
