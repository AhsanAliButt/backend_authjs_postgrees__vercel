"use client";

import { CardContent } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import VerifyToken from "@/lib/actions";
import { Check } from "lucide-react";

type InfoProps = {
  success?: string;
  error?: string;
};
const NewVerification = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  // console.log('🚀 ~ NewVerification ~ token:', token)
  const router = useRouter();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const onSubmit = useCallback(() => {
    if (!token) return;
    VerifyToken(token)
      .then((data) => {
        console.log("Data coming From Verify Token", data);
        if (data.status === 201) {
          setSuccess(data.message);
          router.push("/login");
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
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <div className="bg-slate-600 flex items-center justify-center h-lvh">
      <div className="w-1/2 h-1/2 bg-white flex items-center justify-center">
        <CardContent className="flex flex-col items-center justify-center space-y-10">
          {token ? (
            ""
          ) : (
            <>
              <div className="text-xl text-black">
                Confirm Your Verification
              </div>
              <div className="text-black text-xl">
                Verification Link sent to Your e-mail please check
              </div>
            </>
          )}
          <BeatLoader loading={true} />
          {success && <InfoText success={success} />}
          {error && <InfoText error={error} />}
        </CardContent>
      </div>
    </div>
  );
};

export default NewVerification;

const InfoText: React.FC<InfoProps> = ({ success, error }) => {
  return (
    <>
      {success && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 py-3 rounded relative flex items-center justify-center"
          role="alert"
        >
          <Check className="h-4 w-4 mr-2" />
          <strong className="font-bold">Success:</strong>
          <span className="ml-1 block sm:inline">{success}</span>
        </div>
      )}
      {error && (
        <div
          className=" bg-red-100 border flex border-red-400 text-red-700 px-4 py-3 rounded items-center justify-center"
          role="alert"
        >
          <div>
            {" "}
            <Check className="h-4 w-4 mr-2 mt-[0.3rem]" />
          </div>
          <strong className="font-bold">Error:</strong>
          <span className="ml-1 block sm:inline">{error}</span>
        </div>
      )}
    </>
  );
};
