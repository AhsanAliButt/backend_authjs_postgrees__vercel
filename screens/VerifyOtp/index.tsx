"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation"; // Import useParams to get the dynamic slug
import OtpInput from "react-otp-input";
import { CardContent } from "../../components/ui/card";
import { CardWrapper } from "../CardWrapper/CardWrapper";
import VerifyOtpCode from "@/lib/actions/verifyOtp";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const { slug } = useParams(); // Fetch the slug from dynamic route params
  const router = useRouter();

  useEffect(() => {
    if (slug) {
      console.log("Slug:", slug); // Now you can access the slug (e.g., 'ahsanbutt515')
    }
  }, [slug]);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const onSubmit = useCallback(() => {
    if (!otp) return;
    VerifyOtpCode(otp)
      .then((data) => {
        console.log("Data coming From Verify Token", data);
        if (data.status === 201) {
          setSuccess(data.message);
          console.log("Email >>>", data.email);
          router.push("/signin");
          return;
        } else if (data.status === 404) {
          setError(
            "The token does not exist. Please request a new verification email."
          );
        } else if (data.status === 401) {
          setError(
            "The token has expired. Please request a new verification email."
          );
        } else if (data.status === 400) {
          setError(
            "The associated email does not exist. Please sign up again."
          );
        } else {
          setError("Something went wrong. Please try again.");
        }
      })
      .catch((error) => {
        // Catch any unexpected error
        setError("Something went wrong. Please try again.");
      });
  }, [otp, router]);

  // Automatically verify OTP when the OTP changes and has a length of 4
  useEffect(() => {
    if (otp.length === 4) {
      onSubmit();
    }
  }, [otp, onSubmit]);

  return (
    <div className="bg-slate-600 flex items-center justify-center h-lvh">
      <CardWrapper
        headerlabel={`Please Enter OTP`} // Show the slug in the header if needed
        cardDescription="Check your email; we have sent you an OTP code that expires in 1 hour."
        showSocial={false}
      >
        <CardContent className="flex items-center justify-center p-20">
          <OtpInput
            value={otp}
            containerStyle={{
              color: "black",
            }}
            onChange={setOtp}
            numInputs={4}
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} />}
          />
        </CardContent>
      </CardWrapper>
    </div>
  );
};

export default VerifyOtp;
