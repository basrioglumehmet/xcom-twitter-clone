"use client";

import Links, { DashboardLink } from "@/app/constants/home-links-constant";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

const DashboardLinks = () => {
  const pathname = usePathname();
  const navigation = useRouter();

  return (
    <div className="flex xl:flex-col xl:gap-2 justify-between xl:justify-start w-full ">
      {Links.map((link: DashboardLink) => (
        <div
          key={link.name}
          onClick={() => navigation.push(link.href)}
          className="flex items-center group cursor-pointer flex-1 xl:flex-auto"
        >
          <div
            className={`
              flex flex-row items-center rounded-full p-2 gap-3
              group-hover:bg-background-1
            `}
          >
            <div className="xl:w-8 xl:h-8 w-6 h-6 flex items-center justify-center">
              <link.icon className="w-full h-full  stroke-black " />
            </div>
            <a
              className={`font-medium hidden xl:block ${
                pathname === link.href ? "text-black font-bold" : "text-black"
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
