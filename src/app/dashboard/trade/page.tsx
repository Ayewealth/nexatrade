"use client";

import React, { useEffect } from "react";
import TradeCenter from "../_components/trade";
import { useQuery } from "@tanstack/react-query";
import { getMarkets, getTrades } from "@/actions/auth";
import { setMarket, setTrade } from "@/lib/redux/slice/tradingSlice";
import { useDispatch } from "react-redux";

const Page = () => {
  const dispatch = useDispatch();

  const { data: marketData, isLoading: marketsLoading } = useQuery({
    queryKey: ["markets"],
    queryFn: getMarkets,
    refetchInterval: 5000,
  });

  const { data: tradeData, isLoading: tradesLoading } = useQuery({
    queryKey: ["trades"],
    queryFn: getTrades,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (marketData) {
      dispatch(setMarket({ marketData: marketData }));
    }
    if (tradeData) {
      dispatch(setTrade({ tradeData: tradeData }));
    }
  }, [marketData, tradeData, dispatch]);

  if (marketsLoading || tradesLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TradeCenter />
    </div>
  );
};

export default Page;
