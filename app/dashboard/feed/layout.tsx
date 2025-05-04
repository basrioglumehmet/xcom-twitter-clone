import FeedTabLinks from "@/components/feedtab-link-items";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const FeedLayout = (props: Props) => {
  return (
    <div className="flex flex-col">
      <FeedTabLinks />
      {props.children}
    </div>
  );
};

export default FeedLayout;
