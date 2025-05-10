import { fetchUserProfile } from "@/actions/profile-action";
import ProfileTopSection from "@/components/profile/profile-top-section";
import Tab from "@/components/tab";
import { UserProfileModel } from "@/model/userProfileModel";
import { createClient } from "@/utils/supabase/server";
import { ArrowLeft } from "lucide-react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

//Refactor this layouıt to use client component and server component
const ProfileLayout = async (props: Props) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user profile server-side
  let userProfile: UserProfileModel | null = null;
  if (user?.id) {
    userProfile = await fetchUserProfile(user.id);
  }
  return (
    <div className="flex flex-col ">
      <div className="bg-white bg-opacity-50 p-2 min-h-14 border-b sticky flex items-center top-0 w-full z-10 backdrop-blur-md gap-5">
        <ArrowLeft />
        <div className="flex flex-col ">
          <span className="font-bold xl:text-lg text-sm">
            {userProfile?.screen_name}
          </span>
          <span className="text-sm text-muted-foreground">81 Posts</span>
        </div>
      </div>
      <div className="mb-5">
        <ProfileTopSection userProfile={userProfile} />
      </div>
      <Tab
        tabItems={[
          {
            href: "/dashboard/profile/all",
            name: "Posts",
          },

          {
            href: "/dashboard/profile/replies",
            name: "Replies",
          },
          {
            href: "/dashboard/profile/highlights",
            name: "Highlights",
          },
          {
            href: "/dashboard/profile/likes",
            name: "Likes",
          },
        ]}
      />
      {props.children}
    </div>
  );
};

export default ProfileLayout;
