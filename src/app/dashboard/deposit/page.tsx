"use client";

import React, { useEffect } from "react";
import DepositPage from "../_components/deposit";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getUSDWallet, getWallets } from "@/actions/auth";
import { setUSDWallet, setWalletInfo } from "@/lib/redux/slice/walletSlice";

const Page = () => {
  const dispatch = useDispatch();

  const { data: wallets } = useQuery({
    queryKey: ["wallets"],
    queryFn: getWallets,
  });

  const { data: usdWallet } = useQuery({
    queryKey: ["usdWallet"],
    queryFn: getUSDWallet,
  });

  useEffect(() => {
    if (wallets) {
      dispatch(setWalletInfo({ walletData: wallets }));
    }
    if (usdWallet) {
      dispatch(setUSDWallet(usdWallet));
    }
  }, [wallets, usdWallet, dispatch]);

  return (
    <>
      <DepositPage />
    </>
  );
};

export default Page;
