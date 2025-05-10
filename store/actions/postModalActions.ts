import { PostModel, PostWithProfile } from "@/model/postModel";
import { createAction } from "@reduxjs/toolkit";

export enum POST_MODAL_ACTION_TYPES {
  TOGGLE_POST_MODAL = "TOGGLE_POST_MODAL",
  SET_POST_MODAL_DATA = "SET_POST_MODAL_DATA",
  SET_POST_MODAL_TYPE = "SET_POST_MODAL_TYPE",
}

export const setPostModalData = createAction<PostWithProfile>(
  POST_MODAL_ACTION_TYPES.SET_POST_MODAL_DATA
);

export const setPostModalType = createAction<{
  type: "create" | "edit" | "reply" | null;
}>(POST_MODAL_ACTION_TYPES.SET_POST_MODAL_TYPE);

export const togglePostModal = createAction<{
  isOpen: boolean;
}>(POST_MODAL_ACTION_TYPES.TOGGLE_POST_MODAL);
