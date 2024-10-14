"use client"; // Error components must be Client Components
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Page({}: {}) {
  // useEffect(() => {
  //   // Log the error to an error reporting service
  //   console.error(error);
  // }, [error]);

  return (
    <div className="bg-[#181818] h-lvh flex flex-col items-center justify-center">
      <Image src={"/404-Error-Page.jpg"} width={800} height={800} alt="" />
      <div className="text-white p-6 lg:p-0 text-xl">
        It seems like the page your are trying is only available for members
        please login now to access this page.
      </div>
      <Link href={"/"}>
        <Button className="text-white bg-orange-700 w-60 md:w-96 h-14 text-2xl mt-8 font-roboto border-2 border-white">
          GO BACK
        </Button>
      </Link>
      <p className="text-white font-bold text-4xl mt-8">OR</p>
      <Link href={"/signin"}>
        <Button className="text-white bg-orange-700 w-60 md:w-96 h-14 text-2xl mt-8 font-roboto border-2 border-white">
          Login Now
        </Button>
      </Link>
    </div>
  );
}
