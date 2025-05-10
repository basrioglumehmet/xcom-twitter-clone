"use client";
import feedTabLinks, {
  FeedTabLink,
} from "@/app/constants/feedtab-links-constant";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React from "react";
import { motion } from "motion/react";

interface TabItem {
  name: string;
  href: string;
}

interface TabProps {
  tabItems: TabItem[];
}

const Tab: React.FC<TabProps> = (props) => {
  const pathname = usePathname();
  return (
    <div className="w-full  bg-background   bg-opacity-50 backdrop-blur-md  flex border-b border-border">
      {props.tabItems.map((tab: TabItem) => (
        <a
          key={tab.name}
          href={tab.href}
          className="flex items-center gap-2 text-foreground font-medium hover:bg-background-1 h-full 
          xl:p-3 xl:px-9 
          p-3 px-5
          relative group"
        >
          <span>{tab.name}</span>
          <motion.div
            className={cn(
              "absolute h-1 w-full bottom-0 left-0 bg-primary rounded-lg ",
              pathname === tab.href ? "block" : "hidden"
            )}
          ></motion.div>
        </a>
      ))}
    </div>
  );
};

export default Tab;
