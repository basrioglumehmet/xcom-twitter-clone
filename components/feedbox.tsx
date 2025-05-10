"use client";

import {
  BadgeCheck,
  Bookmark,
  ChartColumnIncreasingIcon,
  Ellipsis,
  HeartIcon,
  MessageCircleIcon,
  MessageCircleReply,
  Repeat2Icon,
  UploadIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useCallback } from "react";
import IntersectionObserverVideo from "./autoplay-video";
import { motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import { ContentType, ExtendedPostModel } from "@/model/postModel";
import { Button } from "./ui/button";
import { useAppDispatch } from "@/store/configureStore";
import {
  setPostModalData,
  setPostModalType,
  togglePostModal,
} from "@/store/actions/postModalActions";
import { createClient } from "@/utils/supabase/client"; // Import Supabase client for client-side
import { getUserLocation } from "@/utils/utils";
import { insertRepostAction } from "@/actions/post-action";

type Props = {
  post: ExtendedPostModel;
};

const FeedBox = (props: Props) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const dispatch = useAppDispatch();
  const isInitialRender = useRef(true);

  // Debounced toggleLike function
  const toggleLike = useCallback(
    debounce(() => {
      setIsLiked((prev) => !prev);
    }, 300),
    []
  );

  // Clean up debounce on component unmount
  useEffect(() => {
    return () => {
      toggleLike.cancel();
    };
  }, [toggleLike]);

  console.log(props.post);

  const renderContentSource = (content_type: ContentType): React.ReactNode => {
    if (content_type === "image") {
      return (
        <div className="px-4 my-2">
          <img
            src={props.post.post_images?.[0]?.url}
            alt="Post"
            className="w-fit max-h-96 object-cover rounded-lg"
          />
        </div>
      );
    }
    return <></>;
  };

  const handleCommentClick = () => {
    dispatch(
      togglePostModal({
        isOpen: true,
      })
    );
    dispatch(setPostModalData(props.post));
    dispatch(
      setPostModalType({
        type: "reply",
      })
    );
  };

  const handleRepostClick = async () => {
    try {
      // Initialize Supabase client
      const supabase = createClient();

      // Get authenticated user
      const { data: userData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !userData.user) {
        toast.error("Authentication required", {
          description: "Please log in to repost.",
        });
        return;
      }

      // Fetch user's profile to get profile_id
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", userData.user.id)
        .single();

      if (profileError || !profileData) {
        toast.error("Profile not found", {
          description: "Unable to fetch your profile.",
        });
        return;
      }

      if (props.post.id != null) {
        // Construct FormData for insertRepost
        const formData = new FormData();
        formData.append(
          "text",
          `Repost of @${props.post.user_profiles?.tag_name}'s post`
        );
        formData.append("contentType", "text" as ContentType);
        formData.append("parent_post_id", props.post.id.toString());
        formData.append("profile_id", profileData.id.toString());

        const { lat, long } = await getUserLocation();

        if (lat && long) {
          formData.append("geo_lat", lat.toString());
          formData.append("geo_long", long.toString());
        }

        // Call insertRepost
        const result = await insertRepostAction(formData);

        if (result.success) {
          toast.success("Post reshared", {
            description: "You successfully reshared this post",
            icon: <Repeat2Icon className="w-5 h-5 text-green-600" />,
          });
        } else {
          toast.error("Failed to repost", {
            description: result.error || "An error occurred while reposting.",
          });
        }
      }
    } catch (error) {
      console.error("Error in handleRepostClick:", error);
      toast.error("Failed to repost", {
        description: "An unexpected error occurred.",
      });
    }
  };

  return (
    <div className="w-full min-h-32 hover:bg-background-2 cursor-pointer">
      <div className="flex flex-col border-b w-full h-full py-4">
        {props.post.isRepliedByYou && (
          <div className="px-4">
            <div className="flex items-center gap-2 font-bold text-muted-foreground text-[12px]">
              <MessageCircleReply className="w-4 h-4 text-muted-foreground" />
              <span>You Replied</span>
            </div>
          </div>
        )}
        {props.post.isRepostedByYou && (
          <div className="px-4">
            <div className="flex items-center gap-2 font-bold text-muted-foreground text-[12px]">
              <MessageCircleReply className="w-4 h-4 text-muted-foreground" />
              <span>You Reposted</span>
            </div>
          </div>
        )}
        <div className="flex flex-row w-full p-4 pb-0">
          <div className="w-10 h-10 bg-background-HOVER rounded-full flex items-center justify-center">
            <img
              src={props.post.user_profiles?.profile_image_url}
              alt="Profile"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col ml-3 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-foreground font-medium">
                {props.post.user_profiles?.screen_name ?? "John Doe"}
              </h1>
              {props.post.user_profiles?.is_verified && (
                <BadgeCheck className="w-4 h-4 text-primary" />
              )}
            </div>
            <p className="text-muted-foreground">
              @{props.post.user_profiles?.tag_name ?? "johndoe"}
            </p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size={"icon"}
              className="rounded-full"
            >
              <svg viewBox="0 0 33 32" className="w-5 h-5" aria-hidden="true">
                <g>
                  <path
                    fill="currentColor"
                    d="M12.745 20.54l10.97-8.19c.539-.4 1.307-.244 1.564.38 1.349 3.288.746 7.241-1.938 9.955-2.683 2.714-6.417 3.31-9.83 1.954l-3.728 1.745c5.347 3.697 11.84 2.782 15.898-1.324 3.219-3.255 4.216-7.692 3.284-11.693l.008.009c-1.351-5.878.332-8.227 3.782-13.031L33 0l-4.54 4.59v-.014L12.743 20.544m-2.263 1.987c-3.837-3.707-3.175-9.446.1-12.755 2.42-2.449 6.388-3.448 9.852-1.979l3.72-1.737c-.67-.49-1.53-1.017-2.515-1.387-4.455-1.854-9.789-.931-13.41 2.728-3.483 3.523-4.579 8.94-2.697 13.561 1.405 3.454-.899 5.898-3.22 8.364C1.49 30.2.666 31.074 0 32l10.478-9.466"
                  ></path>
                </g>
              </svg>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size={"icon"}
              className="rounded-full"
            >
              <Ellipsis />
            </Button>
          </div>
        </div>
        <div className="py-4">
          <p className="text-foreground text-sm px-4">
            {props.post.content ??
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus."}
          </p>
          {renderContentSource(props.post.content_type)}
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 hover:bg-primary hover:bg-opacity-20 flex items-center justify-center rounded-full group/comment"
              onClick={handleCommentClick}
            >
              <MessageCircleIcon className="w-5 h-5 text-muted-foreground group-hover/comment:text-primary" />
            </div>
            <span>
              <p className="text-muted-foreground text-sm">12</p>
            </span>
          </div>
          <div className="flex items-center gap-2" onClick={handleRepostClick}>
            <div className="w-10 h-10 hover:bg-green-600 hover:bg-opacity-20 flex items-center justify-center rounded-full group/reshare">
              <Repeat2Icon className="w-5 h-5 text-muted-foreground group-hover/reshare:text-green-600" />
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
              <ChartColumnIncreasingIcon className="w-5 h-5 text-muted-foreground group-hover/chartColumn:text-primary" />
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
                    <Bookmark className="w-5 h-5 fill-primary text-primary" />
                  ),
                });
              }}
            >
              <Bookmark className="w-5 h-5 text-muted-foreground group-hover/bookmark:text-primary" />
            </div>
            <div
              className="w-10 h-10 hover:bg-primary hover:bg-opacity-20 flex items-center justify-center rounded-full group/share"
              onClick={(e) => {
                toast("Post Downloaded", {
                  description: "You downloaded this post",
                  icon: <UploadIcon className="w-5 h-5 text-primary" />,
                });
              }}
            >
              <UploadIcon className="w-5 h-5 text-muted-foreground group-hover/share:text-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedBox;
