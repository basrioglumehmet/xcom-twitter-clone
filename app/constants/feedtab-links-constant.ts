import React from "react";
import {
  HeartIcon,
  MessageCircleHeartIcon,
  Users2Icon,
  UsersIcon,
} from "lucide-react";

export interface FeedTabLink {
  name: string;
  href: string;
  icon: React.ComponentType | string;
  description: string;
}

const feedTabLinks: FeedTabLink[] = [
  {
    name: "For You",
    href: "/dashboard/feed/for-you",
    icon: MessageCircleHeartIcon,
    description: "View personalized content tailored for you",
  },
  {
    name: "Following",
    href: "/dashboard/feed/following",
    icon: Users2Icon,
    description: "View content from accounts you follow",
  },
];

export default feedTabLinks;
