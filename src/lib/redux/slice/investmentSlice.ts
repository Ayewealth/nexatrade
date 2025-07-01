import { Package, Subscription } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface investmentState {
  packages: Package[];
  subscriptions: Subscription[];
}

const initialState: investmentState = {
  packages: [],
  subscriptions: [],
};

const investmentSlice = createSlice({
  name: "trading",
  initialState,
  reducers: {
    setPackages: (
      state,
      action: PayloadAction<{
        packageData: Package[];
      }>
    ) => {
      const { packageData } = action.payload;
      state.packages = packageData;
    },
    setSubscriptions: (
      state,
      action: PayloadAction<{
        subscriptionData: Subscription[];
      }>
    ) => {
      const { subscriptionData } = action.payload;
      state.subscriptions = subscriptionData;
    },
    // Clear all wallet data
    clearInvestment: (state) => {
      state.packages = [];
      state.subscriptions = [];
    },

    // Reset to initial state
    resetInvestmentState: () => initialState,
  },
});

export const {
  setPackages,
  clearInvestment,
  setSubscriptions,
  resetInvestmentState,
} = investmentSlice.actions;

export default investmentSlice.reducer;

export type transactionHistoryActions =
  | ReturnType<typeof setPackages>
  | ReturnType<typeof setSubscriptions>
  | ReturnType<typeof clearInvestment>
  | ReturnType<typeof resetInvestmentState>;
