import { createAction } from "@reduxjs/toolkit";

export enum OPERATION_MODAL_TYPE {
  TOGGLE_OPERATION_MODAL = "TOGGLE_OPERATION_MODAL",
}

export const toggleOperationModal = createAction<boolean>(
  OPERATION_MODAL_TYPE.TOGGLE_OPERATION_MODAL
);
