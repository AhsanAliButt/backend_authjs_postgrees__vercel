import { auth } from "@/auth";

import AuthButton from "./AuthButton.server";
import SignIn from "@/screens/SignIn";

export default async function Home() {
  const session = await auth();

  return (
    <main>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold">Home Page</h1>
        <pre>{JSON.stringify(session, null, 2)}</pre>
        <SignIn />
      </div>
    </main>
  );
}
