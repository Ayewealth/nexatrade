import {
  PortfolioSummary,
  USDWallet,
  WalletInterface,
  WalletUSDValue,
} from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WalletState {
  walletInfo: WalletInterface[];
  usdWallet: USDWallet[];
  walletUSDValues: WalletUSDValue[];
  portfolioSummary: PortfolioSummary | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  walletInfo: [],
  usdWallet: [],
  walletUSDValues: [],
  portfolioSummary: null,
  isLoading: false,
  error: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    // Loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Set wallet info
    setWalletInfo: (
      state,
      action: PayloadAction<{ walletData: WalletInterface[] }>
    ) => {
      const { walletData } = action.payload;
      state.walletInfo = walletData;
      state.error = null;
    },

    // Set USD wallet
    setUSDWallet: (state, action: PayloadAction<USDWallet[]>) => {
      state.usdWallet = action.payload;
      state.error = null;
    },

    // Set wallet USD values
    setWalletUSDValues: (state, action: PayloadAction<WalletUSDValue[]>) => {
      state.walletUSDValues = action.payload;
      state.error = null;
    },

    // Set portfolio summary
    setPortfolioSummary: (state, action: PayloadAction<PortfolioSummary>) => {
      state.portfolioSummary = action.payload;
      state.error = null;
    },

    // Update specific wallet by ID
    updateWalletById: (
      state,
      action: PayloadAction<{ id: number; updates: Partial<WalletInterface> }>
    ) => {
      const { id, updates } = action.payload;
      const walletIndex = state.walletInfo.findIndex(
        (wallet) => wallet.id === id
      );

      if (walletIndex !== -1) {
        state.walletInfo[walletIndex] = {
          ...state.walletInfo[walletIndex],
          ...updates,
        };
      }
    },

    // Update wallet balance
    updateWalletBalance: (
      state,
      action: PayloadAction<{ id: number; balance: string }>
    ) => {
      const { id, balance } = action.payload;
      const wallet = state.walletInfo.find((w) => w.id === id);

      if (wallet) {
        wallet.balance = balance;
      }
    },

    // Update USD wallet balance
    updateUSDWalletBalance: (
      state,
      action: PayloadAction<{ id: number; balance: string }>
    ) => {
      const { id, balance } = action.payload;
      const wallet = state.usdWallet.find((w) => w.id === id);

      if (wallet) {
        wallet.balance = balance;
      }
    },

    // Clear all wallet data
    clearWalletInfo: (state) => {
      state.walletInfo = [];
      state.usdWallet = [];
      state.walletUSDValues = [];
      state.portfolioSummary = null;
      state.error = null;
    },

    // Reset to initial state
    resetWalletState: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setWalletInfo,
  setUSDWallet,
  setWalletUSDValues,
  setPortfolioSummary,
  updateWalletById,
  updateWalletBalance,
  updateUSDWalletBalance,
  clearWalletInfo,
  resetWalletState,
} = walletSlice.actions;

export default walletSlice.reducer;

// Selectors
export const selectWalletInfo = (state: { wallet: WalletState }) =>
  state.wallet.walletInfo;
export const selectUSDWallet = (state: { wallet: WalletState }) =>
  state.wallet.usdWallet;
export const selectWalletUSDValues = (state: { wallet: WalletState }) =>
  state.wallet.walletUSDValues;
export const selectPortfolioSummary = (state: { wallet: WalletState }) =>
  state.wallet.portfolioSummary;
export const selectWalletLoading = (state: { wallet: WalletState }) =>
  state.wallet.isLoading;
export const selectWalletError = (state: { wallet: WalletState }) =>
  state.wallet.error;

// Get wallet by ID
export const selectWalletById = (state: { wallet: WalletState }, id: number) =>
  state.wallet.walletInfo.find((wallet) => wallet.id === id);

// Get crypto wallet with USD value
export const selectCryptoWalletWithPrice = (
  state: { wallet: WalletState },
  walletId: number
) => state.wallet.walletUSDValues.find((wv) => wv.wallet_id === walletId);
