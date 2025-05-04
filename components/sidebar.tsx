"use client";

import { useEffect, useRef } from "react";
import DashboardLinks from "./home-links";
import Logo from "./logo";
import MiniProfile from "./mini-profile";
import { createClient } from "@/utils/supabase/client";

export default function ClientSidebar() {
  return (
    <div className="flex items-start gap-10 flex-col justify-start w-full h-full relative z-10 py-10">
      <div className="w-10 ">
        <Logo />
      </div>
      <DashboardLinks />
      <div className=" w-full pr-4">
        <button className="bg-white text-black font-semibold text-sm rounded-full w-full px-4 py-2 hover:bg-primary-HOVER transition-colors duration-200 ease-in-out">
          Create Post
        </button>
      </div>
      <div className="flex-1 w-full">
        <MiniProfile />
      </div>
    </div>
  );
}
