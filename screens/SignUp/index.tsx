"use client";

import { CardContent } from "@/components/ui/card";
import { CardWrapper } from "../CardWrapper/CardWrapper";
import SignUpForm from "./form";

const SignUp = () => {
  return (
    <div className="bg-slate-600 flex items-center justify-center h-lvh">
      <CardWrapper
        headerlabel="Create Account"
        cardDescription="Enter your details below"
      >
        <CardContent className="grid gap-4">
          <SignUpForm />
        </CardContent>
      </CardWrapper>
    </div>
  );
};

export default SignUp;
