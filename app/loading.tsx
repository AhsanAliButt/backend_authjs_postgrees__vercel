"use client";
import { Loader2Icon } from "lucide-react";
import { Vortex } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-lvh bg-white w-full">
      <Vortex
        visible={true}
        height="280"
        width="280"
        ariaLabel="vortex-loading"
        wrapperStyle={{}}
        wrapperClass="vortex-wrapper"
        colors={["red", "green", "blue", "yellow", "orange", "purple"]}
      />
    </div>
  );
}
