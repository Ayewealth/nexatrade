import { Transaction } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface transactionHistoryInfo {
  transactionHistoryData: Transaction[];
}

export interface transactionHistoryState {
  transactionHistoryInfo: transactionHistoryInfo;
}

const initialState: transactionHistoryState = {
  transactionHistoryInfo: {
    transactionHistoryData: [
      {
        id: 0,
        user: {
          id: 0,
          username: "",
          full_name: "",
          email: "",
          phone_number: "",
          address: "",
          date_of_birth: "",
          kyc_status: "",
          profile_pic: "",
          is_staff: false,
        },
        transaction_type: null,
        crypto_wallet: null,
        usd_wallet: null,
        amount: "",
        status: null,
        external_address: null,
        created_at: "",
        updated_at: "",
        notes: null,
      },
    ],
  },
};

const transactionHistorySlice = createSlice({
  name: "transactionHistory",
  initialState,
  reducers: {
    setTransactionHistoryInfo: (
      state,
      action: PayloadAction<{
        transactionHistoryData: Transaction[];
      }>
    ) => {
      const { transactionHistoryData } = action.payload;
      state.transactionHistoryInfo.transactionHistoryData =
        transactionHistoryData;
    },
    updateTransactionHistoryInfo: (
      state,
      action: PayloadAction<Partial<Transaction>>
    ) => {
      state.transactionHistoryInfo.transactionHistoryData = {
        ...state.transactionHistoryInfo.transactionHistoryData,
        ...action.payload, // Merge updated fields with the current state
      };
    },
    clearTransactionHistoryInfo: (state) => {
      state.transactionHistoryInfo = initialState.transactionHistoryInfo;
    },
  },
});

export const {
  setTransactionHistoryInfo,
  updateTransactionHistoryInfo,
  clearTransactionHistoryInfo,
} = transactionHistorySlice.actions;

export default transactionHistorySlice.reducer;

export type transactionHistoryActions =
  | ReturnType<typeof setTransactionHistoryInfo>
  | ReturnType<typeof updateTransactionHistoryInfo>
  | ReturnType<typeof clearTransactionHistoryInfo>;
