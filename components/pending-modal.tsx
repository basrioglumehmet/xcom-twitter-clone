"use client";
import { useAppSelector } from "@/store/configureStore";
import React from "react";
import { CircularLoading, RotateLoading } from "respinner";

type Props = {};

const PendingModal = (props: Props) => {
  const isOpen = useAppSelector((state) => state.modal.isOpen);
  if (isOpen) {
    return (
      <div className="bg-background-3 fixed inset-0 flex flex-col bg-opacity-75 backdrop-blur-sm z-50 items-center justify-center">
        <div className="bg-background-3 rounded-xl w-96 h-96 flex flex-col items-center justify-center gap-5">
          <h1 className="text-xl">Pending The Response...</h1>
          <div>
            <RotateLoading size={60} duration={1} stroke="white" />
          </div>
        </div>
      </div>
    );
  }
};

export default PendingModal;
