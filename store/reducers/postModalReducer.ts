import { PostModel, PostWithProfile } from "@/model/postModel";
import { createReducer } from "@reduxjs/toolkit";
import {
  setPostModalData,
  setPostModalType,
  togglePostModal,
} from "../actions/postModalActions";

interface PostModalInitialState {
  isOpen: boolean;
  postData: PostWithProfile | null;
  postModalType: "create" | "edit" | "reply" | null;
}

// Initial state for the post modal reducer
const initialState: PostModalInitialState = {
  isOpen: false,
  postData: null,
  postModalType: null,
};

export const postModalReducer = createReducer(initialState, (builder) => {
  builder.addCase(togglePostModal, (state, action) => {
    state.isOpen = action.payload.isOpen;
  });
  builder.addCase(setPostModalType, (state, action) => {
    state.postModalType = action.payload.type;
  });
  // Handle the action to set post modal data
  builder.addCase(setPostModalData, (state, action) => {
    state.postData = action.payload;
  });
});
