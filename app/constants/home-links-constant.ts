// constants/home-links-constant.tsx
import React from "react";
import {
  BellRingIcon,
  BookmarkIcon,
  CircleEllipsisIcon,
  CogIcon,
  CompassIcon,
  DollarSign,
  EllipsisVertical,
  HomeIcon,
  Mail,
  User2,
  UserCircleIcon,
} from "lucide-react";
import Logo from "@/components/logo";

export interface DashboardLink {
  name: string;
  href: string;
  icon: React.ComponentType | string | React.ReactNode;
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
    icon: Logo,
    description: "View your profile",
  },
  {
    name: "Profile",
    href: "/dashboard/profile/all",
    icon: User2,
    description: "View your profile",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: CogIcon,
    description: "Manage your account settings",
  },
];

export default Links;
