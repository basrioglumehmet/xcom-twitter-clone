//Modal State Type

import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import {
  OPERATION_MODAL_TYPE,
  toggleOperationModal,
} from "../actions/operationModalActions";

interface OperationModalState {
  isOpen: boolean;
}

//Modal Initial States
const initialState: OperationModalState = {
  isOpen: false,
};

//Reducer
const operationModalReducer = createReducer(initialState, (builder) => {
  builder.addCase(toggleOperationModal, (state, action) => {
    state.isOpen = action.payload;
  });
});

export default operationModalReducer;
