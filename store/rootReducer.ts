//Combine the reducers

import { combineReducers } from "@reduxjs/toolkit";
import operationModalReducer from "./reducers/operationModalReducer";
import { profileReducer } from "./reducers/profileReducer";
import { postModalReducer } from "./reducers/postModalReducer";

const rootReducer = combineReducers({
  modal: operationModalReducer,
  profile: profileReducer,
  postModal: postModalReducer,
});

export default rootReducer;
