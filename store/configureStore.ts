import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import logger from "redux-logger"; // Import the logger
import rootReducer from "./rootReducer";

//If using production, please remove logger middleware!
const middlewareArray = [logger];

//Store
const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(middlewareArray);
  },
});

//Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//Hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
