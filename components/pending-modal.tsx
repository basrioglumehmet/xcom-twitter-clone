"use client";
import { useAppSelector } from "@/store/configureStore";
import React from "react";
import { CircularLoading, RotateLoading } from "respinner";

type Props = {};

const PendingModal = (props: Props) => {
  const isOpen = useAppSelector((state) => state.modal.isOpen);
  if (isOpen) {
    return (
      <div className="bg-background-3 fixed inset-0 flex flex-col bg-opacity-75 backdrop-blur-sm z-[9999] items-center justify-center">
        <div className="bg-background-3 text-white rounded-xl w-80 h-80 flex flex-col items-center justify-center gap-5">
          <h1 className="text-xl">Pending The Response...</h1>
          <div>
            <RotateLoading duration={0.5} size={60} stroke="#3b82f6" />
          </div>
        </div>
      </div>
    );
  }
};

export default PendingModal;
