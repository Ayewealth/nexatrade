import { Market, Trade } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface tradingState {
  markets: Market[];
  trades: Trade[];
}

const initialState: tradingState = {
  markets: [],
  trades: [],
};

const tradingSlice = createSlice({
  name: "trading",
  initialState,
  reducers: {
    setMarket: (
      state,
      action: PayloadAction<{
        marketData: Market[];
      }>
    ) => {
      const { marketData } = action.payload;
      state.markets = marketData;
    },
    setTrade: (state, action: PayloadAction<{ tradeData: Trade[] }>) => {
      const { tradeData } = action.payload;
      state.trades = tradeData;
    },
    // Clear all wallet data
    clearTrading: (state) => {
      state.markets = [];
      state.trades = [];
    },

    // Reset to initial state
    resetTradingState: () => initialState,
  },
});

export const { setMarket, clearTrading, setTrade, resetTradingState } =
  tradingSlice.actions;

export default tradingSlice.reducer;

export type transactionHistoryActions =
  | ReturnType<typeof setMarket>
  | ReturnType<typeof setTrade>
  | ReturnType<typeof clearTrading>
  | ReturnType<typeof resetTradingState>;
