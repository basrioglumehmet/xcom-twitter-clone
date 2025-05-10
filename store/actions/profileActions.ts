import { createAction } from "@reduxjs/toolkit";

export enum ProfileActionTypes {
  UPDATE_PROFILE_ID = "UPDATE_PROFILE_ID",
}

export const updateProfileId = createAction<{
  profileId: string;
}>(ProfileActionTypes.UPDATE_PROFILE_ID);
