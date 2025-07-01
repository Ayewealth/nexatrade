import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import Layout from "./_components/layout/client-layout-provider";
import { getUserProfile } from "@/utils/queries";
import {
  getKycStatus,
  getMarkets,
  getPackages,
  getPortfolioSummary,
  getSubscriptions,
  getTrades,
  getTransactionHistory,
  getUSDWallet,
  getWallets,
  getWalletUSDValues,
} from "@/actions/auth";

interface Props {
  children: React.ReactNode;
}

// Your SSR layout with react-query hydration
const layout = async ({ children }: Props) => {
  const query = new QueryClient();

  await query.prefetchQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  await query.prefetchQuery({
    queryKey: ["kycDocument"],
    queryFn: getKycStatus,
  });

  await query.prefetchQuery({
    queryKey: ["transactionHistory"],
    queryFn: getTransactionHistory,
  });

  await query.prefetchQuery({
    queryKey: ["wallets"],
    queryFn: getWallets,
  });

  await query.prefetchQuery({
    queryKey: ["usdWallet"],
    queryFn: getUSDWallet,
  });

  await query.prefetchQuery({
    queryKey: ["walletUSDValues"],
    queryFn: getWalletUSDValues,
  });

  await query.prefetchQuery({
    queryKey: ["portfolioSummary"],
    queryFn: getPortfolioSummary,
  });

  await query.prefetchQuery({
    queryKey: ["markets"],
    queryFn: getMarkets,
  });

  await query.prefetchQuery({
    queryKey: ["trades"],
    queryFn: getTrades,
  });

  await query.prefetchQuery({
    queryKey: ["packages"],
    queryFn: getPackages,
  });

  await query.prefetchQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <Layout>{children}</Layout>
    </HydrationBoundary>
  );
};

export default layout;
