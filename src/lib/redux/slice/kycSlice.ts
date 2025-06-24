import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface KycData {
  id: number;
  user: number | null;
  document_type: string | null;
  document: string | null;
  uploaded_at: string | null;
  status: string | null;
}

interface KycInfo {
  kycData: KycData;
}

export interface KycState {
  kycInfo: KycInfo;
}

const initialState: KycState = {
  kycInfo: {
    kycData: {
      id: 0,
      user: null,
      document_type: null,
      document: null,
      uploaded_at: null,
      status: null,
    },
  },
};

const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    setKycInfo: (
      state,
      action: PayloadAction<{
        kycData: KycData;
      }>
    ) => {
      const { kycData } = action.payload;
      state.kycInfo.kycData = kycData;
    },
    updateKycInfo: (state, action: PayloadAction<Partial<KycData>>) => {
      state.kycInfo.kycData = {
        ...state.kycInfo.kycData,
        ...action.payload, // Merge updated fields with the current state
      };
    },
    clearKycInfo: (state) => {
      state.kycInfo = initialState.kycInfo;
    },
  },
});

export const { setKycInfo, updateKycInfo, clearKycInfo } = kycSlice.actions;

export default kycSlice.reducer;

export type KycActions =
  | ReturnType<typeof setKycInfo>
  | ReturnType<typeof updateKycInfo>
  | ReturnType<typeof clearKycInfo>;
