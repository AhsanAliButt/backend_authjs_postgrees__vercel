import { Suspense } from "react";
import NewVerification from "@/screens/Verification";
import React from "react";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewVerification />
    </Suspense>
  );
};

export default Page;
