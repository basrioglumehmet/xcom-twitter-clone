import FeedBox from "@/components/feedbox";
import React from "react";

type Props = {};

const FollowingPage = (props: Props) => {
  return (
    <div>
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          <FeedBox key={i} />
        ))}
      </div>
    </div>
  );
};

export default FollowingPage;
