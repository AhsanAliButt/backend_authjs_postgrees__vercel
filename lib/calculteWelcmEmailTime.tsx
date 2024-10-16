"use client";
import React, { useEffect } from "react";
import { sendCongratsEmail } from "./actions/getVerificationToken";
import { getVerificationTime } from "./actions/user";
import { useSession } from "next-auth/react";

const VerifyCongrats = () => {
  const { data: session } = useSession();
  useEffect(() => {
    const checkVerificationTime = async () => {
      // try {
      //   const user = await getVerificationTime();
      //   const verificationTime = new Date(session?.user.verified);
      //   const currentTime = new Date();
      //   // Check if 1 hour has passed since verification
      //   const oneHourPassed = currentTime - verificationTime >= 3600000; // 3600000 ms in an hour
      //   // Check if email has already been sent
      //   if (!user.congratsEmailSent && oneHourPassed) {
      //     // Send congratulatory email
      //     await sendCongratsEmail(user.name, user.email);
      //     console.log("Congrats email sent to:", user.email);
      //   } else if (user.congratsEmailSent) {
      //     console.log("Congrats email has already been sent.");
      //   } else {
      //     console.log("Not yet one hour since verification.");
      //   }
      // } catch (error) {
      //   console.error("Error checking verification time:", error);
      // }
    };

    checkVerificationTime();
  }, []);

  return <div>Checking verification...</div>;
};

export default VerifyCongrats;
