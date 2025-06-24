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
  getPortfolioSummary,
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

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <Layout>{children}</Layout>
    </HydrationBoundary>
  );
};

export default layout;
