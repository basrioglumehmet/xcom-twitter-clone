"use client";

import Links, { DashboardLink } from "@/app/constants/home-links-constant";
import React from "react";
import { usePathname } from "next/navigation";

const DashboardLinks = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-5 w-full text-lg">
      {Links.map((link: DashboardLink) => (
        <div key={link.name} className="flex items-center group cursor-pointer">
          <div
            className={`
              flex flex-row items-center rounded-full p-2 gap-3
              group-hover:bg-background-1
            `}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <link.icon className="w-6 h-6  stroke-white " />
            </div>
            <a
              href={link.href}
              className={`font-medium ${
                pathname === link.href ? "text-white font-bold" : "text-white"
              }`}
            >
              {link.name}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardLinks;
