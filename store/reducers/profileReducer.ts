import { createReducer } from "@reduxjs/toolkit";
import { updateProfileId } from "../actions/profileActions";

interface ProfileReducerState {
  profileId: string | null;
}

const initialState: ProfileReducerState = {
  profileId: null,
};

export const profileReducer = createReducer(initialState, (builder) => {
  builder.addCase(updateProfileId, (state, action) => {
    state.profileId = action.payload.profileId;
  });
});
