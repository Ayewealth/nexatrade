"use client";

import React, { useEffect } from "react";
import AdminDashboard from "../_components/home";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  getAdminActions,
  getAllKyc,
  getTrades,
  getTransactionHistory,
} from "@/actions/auth";
import { setTransactionHistoryInfo } from "@/lib/redux/slice/transactionSlice";
import { setTrade } from "@/lib/redux/slice/tradingSlice";
import { setAdminActions, setAllKycs } from "@/lib/redux/slice/adminSlice";

const Page = () => {
  const dispatch = useDispatch();

  const { data, isLoading } = useQuery({
    queryKey: ["transactionHistory"],
    queryFn: getTransactionHistory,
  });

  const { data: tradeData, isLoading: tradesLoading } = useQuery({
    queryKey: ["trades"],
    queryFn: getTrades,
    refetchInterval: 5000,
  });

  const { data: kycs, isLoading: kycsLoading } = useQuery({
    queryKey: ["allKycs"],
    queryFn: getAllKyc,
    refetchInterval: 5000,
  });

  const { data: adminActionsData, isLoading: adminActionsDataLoading } =
    useQuery({
      queryKey: ["allAdminActions"],
      queryFn: getAdminActions,
      refetchInterval: 5000,
    });

  useEffect(() => {
    if (data) {
      dispatch(
        setTransactionHistoryInfo({
          transactionHistoryData: data,
        })
      );
    }
    if (tradeData) {
      dispatch(setTrade({ tradeData: tradeData }));
    }
    if (kycs) {
      dispatch(setAllKycs({ kycsData: kycs }));
    }
    if (adminActionsData) {
      dispatch(setAdminActions({ adminActionsData: adminActionsData }));
    }
  }, [data, tradeData, kycs, adminActionsData, dispatch]);

  if (isLoading || tradesLoading || kycsLoading || adminActionsDataLoading) {
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
      <AdminDashboard />
    </div>
  );
};

export default Page;
