//Combine the reducers

import { combineReducers } from "@reduxjs/toolkit";
import operationModalReducer from "./reducers/operationModalReducer";

const rootReducer = combineReducers({
  modal: operationModalReducer,
});

export default rootReducer;
