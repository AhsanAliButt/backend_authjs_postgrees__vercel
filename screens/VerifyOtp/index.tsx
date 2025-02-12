"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation"; // Import useParams to get the dynamic slug
import OtpInput from "react-otp-input";
import { CardContent } from "../../components/ui/card";
import { CardWrapper } from "../CardWrapper/CardWrapper";
import VerifyOtpCode from "@/lib/actions/verifyOtp";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { BeatLoader } from "react-spinners";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const { slug } = useParams(); // Fetch the slug from dynamic route params
  const router = useRouter();
const [loading,setLoading]=useState(false)
  useEffect(() => {
    if (slug) {
      console.log("Slug:", slug); // Now you can access the slug (e.g., 'ahsanbutt515')
    }
  }, [slug]);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const onSubmit = useCallback(() => {
    setLoading(true)
    if (!otp) return;
    VerifyOtpCode(otp)
      .then(async (data) => {
        if (data.status === 201) {
          setSuccess(data.message);
          // router.push("/signin");
          // Auto-sign in after OTP verification
          try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, 
      });

      if (response?.error) {
        setLoading(false)
        toast.error(response.error);
      }

      // If successful
      if (response?.ok) {
        setLoading(false)
        toast.success("Login successful!"); 
        router.push("/");
      }
    } catch (err: any) {
      setLoading(false)
      console.error("Error during sign in", err);
      toast.error("Failed to login: " + (err.message || "An unexpected error occurred."));
    }

          

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
        <CardContent className="flex flex-col items-center justify-center p-20">
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
        <div className=" flex items-center justify-center">
        <BeatLoader color="white" loading={true} />
        </div>
      </CardWrapper>
      
    </div>
  );
};

export default VerifyOtp;
