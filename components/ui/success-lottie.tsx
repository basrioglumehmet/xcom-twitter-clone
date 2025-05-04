"use client";
import React from "react";
import dynamic from "next/dynamic";
import animationData from "@/assets/success.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type Props = {};

const SuccessLottie = (props: Props) => {
  return (
    <div>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default SuccessLottie;
