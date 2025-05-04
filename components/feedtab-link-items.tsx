"use client";
import feedTabLinks, {
  FeedTabLink,
} from "@/app/constants/feedtab-links-constant";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React from "react";
import { motion } from "motion/react";

interface FeedTabLinksProps {}

const FeedTabLinks: React.FC<FeedTabLinksProps> = () => {
  const pathname = usePathname();
  return (
    <div className="w-full sticky top-0 bg-background bg-opacity-50 backdrop-blur-md z-10 flex border-b border-border">
      {feedTabLinks.map((link: FeedTabLink) => (
        <a
          key={link.name}
          href={link.href}
          className="flex items-center gap-2 text-foreground font-medium hover:bg-background-1 h-full p-3 px-9 relative group"
        >
          <span>{link.name}</span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: pathname === link.href ? 1 : 0 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "absolute h-1 w-full bottom-0 left-0 bg-primary rounded-lg "
            )}
          ></motion.div>
        </a>
      ))}
    </div>
  );
};

export default FeedTabLinks;
