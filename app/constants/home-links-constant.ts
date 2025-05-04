// constants/home-links-constant.tsx
import React from "react";
import {
  BellRingIcon,
  BookmarkIcon,
  CircleEllipsisIcon,
  CompassIcon,
  DollarSign,
  HomeIcon,
  Mail,
  UserCircleIcon,
} from "lucide-react";

export interface DashboardLink {
  name: string;
  href: string;
  icon: React.ComponentType | string;
  description: string;
}

const Links: DashboardLink[] = [
  {
    name: "Home",
    href: "/",
    icon: HomeIcon,
    description: "Go to the dashboard page",
  },
  {
    name: "Explore",
    href: "/explore",
    icon: CompassIcon,
    description: "Go to the dashboard page",
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: BellRingIcon,
    description: "View your profile",
  },
  {
    name: "Messages",
    href: "/messages",
    icon: Mail,
    description: "View your profile",
  },
  {
    name: "Bookmarks",
    href: "/bookmarks",
    icon: BookmarkIcon,
    description: "View your profile",
  },
  {
    name: "Premium",
    href: "/premium",
    icon: DollarSign,
    description: "View your profile",
  },
  {
    name: "Profile",
    href: "/profile",
    icon: UserCircleIcon,
    description: "View your profile",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: CircleEllipsisIcon,
    description: "Manage your account settings",
  },
];

export default Links;
