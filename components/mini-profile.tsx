import { EllipsisIcon, EllipsisVerticalIcon } from "lucide-react";
import React from "react";

type Props = {};

const MiniProfile = (props: Props) => {
  return (
    <div className="w-full pr-6">
      <div className="flex flex-row w-full">
        <div className="w-10 h-10 bg-background-HOVER rounded-full flex items-center justify-center">
          <img
            src="https://i.pinimg.com/736x/7b/4c/e5/7b4ce54a528d667167d1644f2eff6080.jpg"
            alt="Profile"
            className="rounded-full w-full h-full"
          />
        </div>
        <div className="flex flex-col ml-3 flex-1">
          <h1 className="text-foreground font-medium">John Doe</h1>
          <p className="text-muted-foreground">@johndoe</p>
        </div>
        <div className="flex items-center justify-end ">
          <button>
            <EllipsisVerticalIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniProfile;
