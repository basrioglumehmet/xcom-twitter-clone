import { EllipsisIcon, EllipsisVerticalIcon } from "lucide-react";
import React from "react";

type Props = {};

const MiniProfile = (props: Props) => {
  return (
    <div className="w-full pr-6">
      <div className="flex flex-row w-full">
        <div className="w-10 h-10 bg-background-HOVER rounded-full flex items-center justify-center">
          <img
            src="https://i.pinimg.com/736x/8b/e2/b0/8be2b0524206cab7eceabf92f3c0260a.jpg"
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
            <EllipsisIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniProfile;
