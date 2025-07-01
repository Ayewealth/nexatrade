import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import Layout from "./_components/layout/admin-layout-provider";
import {
  getAdminActions,
  getAllKyc,
  getTrades,
  getTransactionHistory,
} from "@/actions/auth";
interface Props {
  children: React.ReactNode;
}

// Your SSR layout with react-query hydration
const layout = async ({ children }: Props) => {
  const query = new QueryClient();

  await query.prefetchQuery({
    queryKey: ["transactionHistory"],
    queryFn: getTransactionHistory,
  });

  await query.prefetchQuery({
    queryKey: ["trades"],
    queryFn: getTrades,
  });

  await query.prefetchQuery({
    queryKey: ["allKycs"],
    queryFn: getAllKyc,
  });

  await query.prefetchQuery({
    queryKey: ["allAdminActions"],
    queryFn: getAdminActions,
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <Layout>{children}</Layout>
    </HydrationBoundary>
  );
};

export default layout;
