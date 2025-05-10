"use client";

import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useCallback, useState, useMemo } from "react";
import { RotateLoading } from "respinner";
import NewPostActionButton from "./profile/new-post-action-btn";
import debounce from "lodash/debounce";
import { useAppDispatch } from "@/store/configureStore";
import { updateProfileId } from "@/store/actions/profileActions";
import FeedBox from "./feedbox";
import {
  ExtendedPostModel,
  PostWithProfile,
  PostModel,
} from "@/model/postModel";

interface LoadingState {
  user: boolean;
  profile: boolean;
  posts: boolean;
}

const ProfilePosts: React.FC = () => {
  const supabase = createClient();
  const dispatch = useAppDispatch();
  const [userId, setUserId] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [profilePosts, setProfilePosts] = useState<ExtendedPostModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    user: true,
    profile: true,
    posts: true,
  });

  const fetchUserAndProfile = useCallback(async () => {
    const [userResponse, profileResponse] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from("user_profiles").select("id, user_id").maybeSingle(),
    ]);

    const {
      data: { user },
      error: userError,
    } = userResponse;
    if (userError || !user?.id) {
      throw new Error(userError?.message || "No user found. Please log in.");
    }
    setUserId(user.id);

    const { data: profileData, error: profileError } = profileResponse;
    if (profileError) {
      throw new Error(`Failed to fetch profile: ${profileError.message}`);
    }
    const profileIdNum = profileData?.id ? parseInt(profileData.id) : null;
    setProfileId(profileIdNum);
    if (profileIdNum) {
      dispatch(
        updateProfileId({
          profileId: profileIdNum.toString(),
        })
      );
    }

    return { userId: user.id, profileId: profileIdNum };
  }, [supabase, dispatch]);

  const fetchPostsData = useCallback(
    async (profileId: number) => {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(
          `
          *,
          user_profiles:user_profiles (
            id,
            screen_name,
            tag_name,
            is_verified,
            profile_image_url
          ),
          post_images:post_images (
            id,
            post_id,
            url
          )
        `
        )
        .eq("profile_id", profileId)
        .returns<PostWithProfile[]>();

      if (postsError) {
        throw new Error(`Failed to fetch posts: ${postsError.message}`);
      }
      return postsData || [];
    },
    [supabase]
  );

  const fetchUserInteractions = useCallback(
    async (profileId: number) => {
      const { data: userPosts, error: userPostsError } = await supabase
        .from("posts")
        .select("id")
        .eq("profile_id", profileId);

      if (userPostsError) {
        throw new Error(
          `Failed to fetch user posts: ${userPostsError.message}`
        );
      }
      const userPostIds = new Set(userPosts.map((post) => post.id));

      const [
        { data: userReplies, error: repliesError },
        { data: userReposts, error: repostError },
      ] = await Promise.all([
        supabase
          .from("post_replies")
          .select("reply_post_id")
          .in("reply_post_id", Array.from(userPostIds)),
        supabase
          .from("post_reposts")
          .select("repost_id, parent_post_id")
          .in("repost_id", Array.from(userPostIds)),
      ]);

      if (repliesError) {
        throw new Error(`Failed to fetch replies: ${repliesError.message}`);
      }
      if (repostError) {
        throw new Error(`Failed to fetch reposts: ${repostError.message}`);
      }

      return { userPostIds, userReplies, userReposts };
    },
    [supabase]
  );

  const fetchParentPosts = useCallback(
    async (parentPostIds: number[]) => {
      if (!parentPostIds.length) return [];

      const { data: parentPosts, error: parentPostsError } = await supabase
        .from("posts")
        .select(
          `
          *,
          user_profiles:user_profiles (
            id,
            screen_name,
            tag_name,
            is_verified,
            profile_image_url
          ),
          post_images:post_images (
            id,
            post_id,
            url
          )
        `
        )
        .in("id", parentPostIds)
        .returns<PostWithProfile[]>();

      if (parentPostsError) {
        throw new Error(
          `Failed to fetch parent posts: ${parentPostsError.message}`
        );
      }
      return parentPosts || [];
    },
    [supabase]
  );

  const fetchData = useCallback(async () => {
    setLoading({ user: true, profile: true, posts: true });
    setError(null);
    setProfilePosts([]);

    try {
      const { profileId } = await fetchUserAndProfile();
      if (!profileId) {
        setProfilePosts([]);
        return;
      }

      const [postsData, { userPostIds, userReplies, userReposts }] =
        await Promise.all([
          fetchPostsData(profileId),
          fetchUserInteractions(profileId),
        ]);

      const replyPostIds = new Set(
        userReplies.map((reply) => reply.reply_post_id)
      );
      const repostIds = new Set(userReposts.map((repost) => repost.repost_id));
      const parentPostIds = userReposts
        .map((repost) => repost.parent_post_id)
        .filter(Boolean);
      const parentPostsData = await fetchParentPosts(parentPostIds);
      const parentPostsMap = new Map(
        parentPostsData.map((post) => [post.id, post])
      );

      const formattedPosts: ExtendedPostModel[] = postsData.map((post) => {
        const isRepliedByYou = replyPostIds.has(post.id);
        const isRepostedByYou = repostIds.has(post.id);
        const repostEntry = isRepostedByYou
          ? userReposts.find((repost) => repost.repost_id === post.id)
          : null;
        const parentPost = repostEntry?.parent_post_id
          ? parentPostsMap.get(repostEntry.parent_post_id)
          : null;

        return {
          ...post, // Spread includes user_profiles and post_images
          isRepliedByYou,
          isRepostedByYou,
          parentPost, // Correct field name and type
        };
      });

      setProfilePosts(formattedPosts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setUserId(null);
      setProfileId(null);
      setProfilePosts([]);
    } finally {
      setLoading({ user: false, profile: false, posts: false });
    }
  }, [
    fetchUserAndProfile,
    fetchPostsData,
    fetchUserInteractions,
    fetchParentPosts,
  ]);

  const debouncedFetchData = useMemo(
    () => debounce(fetchData, 500, { leading: false, trailing: true }),
    [fetchData]
  );

  useEffect(() => {
    fetchData();
    return () => debouncedFetchData.cancel();
  }, [fetchData, debouncedFetchData]);

  const content = useMemo(() => {
    if (loading.user || loading.profile || loading.posts) {
      return (
        <div className="flex justify-center items-center py-8">
          <RotateLoading duration={0.5} stroke="#3b82f6" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-red-500 p-4">
          <p>Error: {error}</p>
          <button
            className="mt-2 text-blue-500 underline"
            onClick={debouncedFetchData}
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <div>
        {profilePosts.length > 0 ? (
          profilePosts.map((post) => <FeedBox post={post} key={post.id} />)
        ) : (
          <p>No posts available.</p>
        )}
        <NewPostActionButton />
      </div>
    );
  }, [loading, error, profilePosts, debouncedFetchData]);

  return content;
};

export default ProfilePosts;
