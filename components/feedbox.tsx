"use client";
import {
  Bookmark,
  ChartColumnIncreasingIcon,
  EllipsisIcon,
  HeartIcon,
  MessageCircleIcon,
  Repeat2Icon,
  UploadIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import IntersectionObserverVideo from "./autoplay-video";
import { motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
type Props = {};

const FeedBox = (props: Props) => {
  const [isLiked, setIsLiked] = React.useState(false);

  const toggleLike = () => {
    setIsLiked((prev) => !prev);
  };

  const handleLikeNotification = (isLiked: boolean) => {
    toast(isLiked ? "Post liked" : "Post unliked", {
      description: isLiked ? "You liked this post" : "You unliked this post",
      icon: (
        <HeartIcon
          className={cn(
            "w-5 h-5",
            isLiked ? "fill-destructive text-destructive" : ""
          )}
        />
      ),
    });
  };

  useEffect(() => {
    handleLikeNotification(isLiked);
  }, [isLiked]);

  return (
    <motion.div
      className="w-full hover:bg-background-2 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, type: "spring", bounce: 0.3, stiffness: 100 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col min-h-60 border-b w-full ">
        <div className="flex flex-row w-full p-4 pb-0">
          <div className="w-10 h-10 bg-background-HOVER rounded-full flex items-center justify-center">
            <img
              src="https://i.pinimg.com/736x/8b/e2/b0/8be2b0524206cab7eceabf92f3c0260a.jpg"
              alt="Profile"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col ml-3 flex-1">
            <h1 className="text-foreground font-medium">John Doe</h1>
            <p className="text-muted-foreground">@johndoe</p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button>
              <svg viewBox="0 0 33 32" className="w-5 h-5" aria-hidden="true">
                <g>
                  <path
                    fill="white"
                    d="M12.745 20.54l10.97-8.19c.539-.4 1.307-.244 1.564.38 1.349 3.288.746 7.241-1.938 9.955-2.683 2.714-6.417 3.31-9.83 1.954l-3.728 1.745c5.347 3.697 11.84 2.782 15.898-1.324 3.219-3.255 4.216-7.692 3.284-11.693l.008.009c-1.351-5.878.332-8.227 3.782-13.031L33 0l-4.54 4.59v-.014L12.743 20.544m-2.263 1.987c-3.837-3.707-3.175-9.446.1-12.755 2.42-2.449 6.388-3.448 9.852-1.979l3.72-1.737c-.67-.49-1.53-1.017-2.515-1.387-4.455-1.854-9.789-.931-13.41 2.728-3.483 3.523-4.579 8.94-2.697 13.561 1.405 3.454-.899 5.898-3.22 8.364C1.49 30.2.666 31.074 0 32l10.478-9.466"
                  ></path>
                </g>
              </svg>
            </button>
            <button>
              <EllipsisIcon />
            </button>
          </div>
        </div>
        <div>
          <p className="text-foreground text-sm px-4 mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            voluptatibus.
          </p>
          <motion.div className="flex flex-col gap-2 mt-2 p-5">
            {/* <Image
              src="https://i.pinimg.com/736x/a0/a4/6b/a0a46b5f3b632e6f5f8850c18c050cbb.jpg"
              alt="Post Image"
              width={500}
              height={200}
              className="rounded-lg w-fit h-96"
            /> */}
            <IntersectionObserverVideo
              isLiked={isLiked}
              setIsLiked={setIsLiked}
              src="/videos/happynation.mp4"
            />
          </motion.div>
        </div>
        <div className="flex justify-between px-5 items-center mt-2  w-full p-5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 hover:bg-primary hover:bg-opacity-20 flex items-center justify-center rounded-full group/comment">
              <MessageCircleIcon className="w-5 h-5 text-muted-foreground group-hover/comment:text-primary " />
            </div>
            <span>
              <p className="text-muted-foreground text-sm">12</p>
            </span>
          </div>

          <div
            className="flex items-center gap-2"
            onClick={(e) => {
              toast("Post reshared", {
                description: "You reshared this post",
                icon: <Repeat2Icon className="w-5 h-5  text-green-600 " />,
              });
            }}
          >
            <div className="w-10 h-10 hover:bg-green-600 hover:bg-opacity-20 flex items-center justify-center rounded-full group/reshare">
              <Repeat2Icon className="w-5 h-5 text-muted-foreground group-hover/reshare:text-green-600 " />
            </div>
            <span>
              <p className="text-muted-foreground text-sm">12</p>
            </span>
          </div>
          <div className="flex items-center gap-2" onClick={toggleLike}>
            <div className="w-10 h-10 hover:bg-destructive hover:bg-opacity-20 flex items-center justify-center rounded-full group/like">
              <HeartIcon
                className={cn(
                  "w-5 h-5 text-muted-foreground group-hover/like:text-destructive",
                  isLiked ? "fill-destructive text-destructive" : ""
                )}
              />
            </div>
            <span>
              <p className="text-muted-foreground text-sm">12</p>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 hover:bg-primary hover:bg-opacity-20 flex items-center justify-center rounded-full group/chartColumn">
              <ChartColumnIncreasingIcon className="w-5 h-5 text-muted-foreground group-hover/chartColumn:text-primary " />
            </div>
            <span>
              <p className="text-muted-foreground text-sm">12</p>
            </span>
          </div>

          <div className="flex items-center">
            <div
              className="w-10 h-10 hover:bg-primary hover:bg-opacity-20 flex items-center justify-center rounded-full group/bookmark"
              onClick={(e) => {
                toast("Post bookmarked", {
                  description: "You bookmarked this post",
                  icon: (
                    <Bookmark className="w-5 h-5 fill-primary text-primary " />
                  ),
                });
              }}
            >
              <Bookmark className="w-5 h-5 text-muted-foreground group-hover/bookmark:text-primary " />
            </div>
            <div
              className="w-10 h-10 hover:bg-primary hover:bg-opacity-20 flex items-center justify-center rounded-full group/share"
              onClick={(e) => {
                toast("Post Downloaded", {
                  description: "You downloaded this post",
                  icon: <UploadIcon className="w-5 h-5  text-primary " />,
                });
              }}
            >
              <UploadIcon className="w-5 h-5 text-muted-foreground group-hover/share:text-primary " />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedBox;
