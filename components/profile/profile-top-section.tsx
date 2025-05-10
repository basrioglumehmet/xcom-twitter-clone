"use client";
import React from "react";
import { Suspense } from "react";
import {
  BadgeCheck,
  CalendarDaysIcon,
  Camera,
  MapPin,
  SwitchCamera,
  ThumbsUp,
  X,
  ZoomIn,
} from "lucide-react";
import { RotateLoading } from "respinner";
import { UserProfileModel } from "@/model/userProfileModel";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "motion/react";
type Props = {
  userProfile: UserProfileModel | null;
};

const ProfileTopSectionContent = ({ userProfile }: Props) => {
  const [isAvatarHovered, setIsAvatarHovered] = React.useState(false);
  const [isAvatarBigView, setIsAvatarBigView] = React.useState(false);
  return (
    <div className="relative">
      <div className="border-b bg-primary w-full h-60" />
      <div className="flex -mt-10 xl:-mt-16 px-6 items-end justify-between">
        <div
          className="xl:w-36 xl:h-36 w-24 h-24 relative  rounded-full bg-white overflow-hidden p-1 cursor-pointer"
          onMouseEnter={() => setIsAvatarHovered(true)}
          onMouseLeave={() => setIsAvatarHovered(false)}
          onClick={() => {
            setIsAvatarHovered(false);
            setIsAvatarBigView(!isAvatarBigView);
          }}
        >
          <Avatar className="w-full h-full bg-background-1">
            <AvatarImage
              src={userProfile?.profile_image_url}
              alt="Profile"
              className="rounded-full w-full h-full object-cover"
            />
            <AvatarFallback className="bg-background-1 text-primary text-3xl">
              <RotateLoading duration={0.5} stroke="#3b82f6" />
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {isAvatarHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
                whileTap={{ scale: 0.9 }}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-full"
              ></motion.div>
            )}
          </AnimatePresence>
        </div>
        <div>
          <Button variant="outline">Edit Profile</Button>
        </div>
      </div>

      <AnimatePresence>
        {isAvatarBigView && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[9999] bg-black bg-opacity-75 text-white "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
            onClick={() => setIsAvatarBigView(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
              className="relative"
            >
              <Avatar className="w-96 h-96 bg-background-1 rounded-none">
                <AvatarImage
                  src={userProfile?.profile_image_url}
                  alt="Profile"
                  className="rounded-none w-full h-full object-cover"
                />
                <AvatarFallback className="bg-background-1 text-primary text-3xl">
                  {userProfile?.screen_name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="absolute top-5 right-5 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsAvatarBigView(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col gap-5 px-6 mt-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="first-letter:uppercase text-xl font-bold">
              {userProfile?.screen_name || "Unknown User"}
            </span>
            {userProfile?.is_verified && (
              <BadgeCheck className="text-primary" />
            )}
          </div>
          <span className="text-muted-foreground">
            @{userProfile?.tag_name || "unknown"}
          </span>
        </div>
        <div className="flex flex-col gap-5">
          <p>
            {userProfile?.description ||
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti temporibus, perferendis sed maiores amet laboriosam consequuntur placeat officia ex atque aspernatur, iste praesentium neque fugit dicta veniam, rem repellendus incidunt!"}
          </p>
          <div className="flex  gap-5">
            <div className="flex items-center justify-center text-muted-foreground gap-2">
              <MapPin className="w-5 h-5" />
              <span>{userProfile?.location || "Unknown location"}</span>
            </div>
            <div className="flex items-center justify-center text-muted-foreground gap-2">
              <CalendarDaysIcon className="w-5 h-5" />
              <span>
                Joined{" "}
                {userProfile?.created_at
                  ? new Date(userProfile.created_at).toLocaleString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "Unknown"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileTopSection = (props: Props) => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-60">
          <RotateLoading duration={0.5} size={60} stroke="#3b82f6" />
        </div>
      }
    >
      <ProfileTopSectionContent {...props} />
    </Suspense>
  );
};

export default ProfileTopSection;
