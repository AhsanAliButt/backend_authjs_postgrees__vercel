"use client";

import { CardContent } from "../../components/ui/card";
import { useEffect } from "react";
import { CardWrapper } from "../CardWrapper/CardWrapper";
import SignInForm from "./form";

const SignIn = () => {
  return (
    <div className="bg-slate-600 flex items-center justify-center h-lvh">
      <CardWrapper
        headerlabel="Please Login Now"
        cardDescription="Enter your login details below"
      >
        <CardContent className="grid gap-4">
          <SignInForm />
        </CardContent>
      </CardWrapper>
    </div>
  );
};

export default SignIn;
