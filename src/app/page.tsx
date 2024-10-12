import { auth } from "@/auth";

import AuthButton from "./AuthButton.server";
import SignIn from "@/screens/SignIn";

export default async function Home() {
  const session = await auth();

  return (
    <main>
      <h1 className="text-3xl font-bold">Home Page</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <SignIn />
    </main>
  );
}
