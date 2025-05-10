import ProfilePosts from "@/components/profile-posts";
import React from "react";

type Props = {};

const ProfileAllPage = (props: Props) => {
  return (
    <div className="flex flex-col">
      <ProfilePosts />
    </div>
  );
};

export default ProfileAllPage;
