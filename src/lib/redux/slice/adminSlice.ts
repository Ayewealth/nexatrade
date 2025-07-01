import { AdminActions, KYCS } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface adminState {
  kycs: KYCS[];
  adminActions: AdminActions[];
}

const initialState: adminState = {
  kycs: [],
  adminActions: [],
};

const adminSlice = createSlice({
  name: "trading",
  initialState,
  reducers: {
    setAllKycs: (
      state,
      action: PayloadAction<{
        kycsData: KYCS[];
      }>
    ) => {
      const { kycsData } = action.payload;
      state.kycs = kycsData;
    },
    setAdminActions: (
      state,
      action: PayloadAction<{
        adminActionsData: AdminActions[];
      }>
    ) => {
      const { adminActionsData } = action.payload;
      state.adminActions = adminActionsData;
    },
    // Clear all wallet data
    clearAdminSlice: (state) => {
      state.kycs = [];
    },

    // Reset to initial state
    resetAdminState: () => initialState,
  },
});

export const { setAllKycs, clearAdminSlice, setAdminActions, resetAdminState } =
  adminSlice.actions;

export default adminSlice.reducer;

export type transactionHistoryActions =
  | ReturnType<typeof setAllKycs>
  | ReturnType<typeof setAdminActions>
  | ReturnType<typeof clearAdminSlice>
  | ReturnType<typeof resetAdminState>;
