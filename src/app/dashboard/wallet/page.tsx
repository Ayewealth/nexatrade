"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  getPortfolioSummary,
  getUSDWallet,
  getWallets,
  getWalletUSDValues,
} from "@/actions/auth";
import {
  setError,
  setLoading,
  setPortfolioSummary,
  setUSDWallet,
  setWalletInfo,
  setWalletUSDValues,
} from "@/lib/redux/slice/walletSlice";
import { useAppSelector } from "@/lib/redux/store";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Activity,
  AlertCircle,
  BarChart3,
  DollarSign,
  Eye,
  EyeOff,
  Minus,
  PieChart,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatBalance, formatCurrency } from "@/utils/wallet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Convert from "../_components/convert";

const Page = () => {
  const dispatch = useDispatch();
  const [showBalances, setShowBalances] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    walletInfo,
    usdWallet,
    isLoading,
    error,
    portfolioSummary,
    walletUSDValues,
  } = useAppSelector((state) => state.wallet);

  const {
    data: wallets,
    refetch: refetchWallets,
    isLoading: walletsLoading,
    error: walletsError,
  } = useQuery({
    queryKey: ["wallets"],
    queryFn: getWallets,
  });

  const {
    data: usdWalletData,
    refetch: refetchUSDWallet,
    isLoading: usdLoading,
    error: usdError,
  } = useQuery({
    queryKey: ["usdWallet"],
    queryFn: getUSDWallet,
  });

  const {
    data: walletValuesData,
    refetch: refetchWalletValues,
    isLoading: valuesLoading,
    error: valuesError,
  } = useQuery({
    queryKey: ["walletUSDValues"],
    queryFn: getWalletUSDValues,
    enabled: walletInfo.length > 0,
  });

  const {
    data: portfolioData,
    refetch: refetchPortfolio,
    isLoading: portfolioLoading,
    error: portfolioError,
  } = useQuery({
    queryKey: ["portfolioSummary"],
    queryFn: getPortfolioSummary,
  });

  useEffect(() => {
    if (wallets) {
      dispatch(setWalletInfo({ walletData: wallets }));
    }
    if (usdWalletData) {
      dispatch(setUSDWallet(usdWalletData));
    }
    if (walletValuesData) {
      dispatch(setWalletUSDValues(walletValuesData));
    }
    if (portfolioData) {
      dispatch(setPortfolioSummary(portfolioData));
    }
  }, [wallets, usdWalletData, walletValuesData, portfolioData, dispatch]);

  // Update loading state
  useEffect(() => {
    const loading =
      walletsLoading || usdLoading || valuesLoading || portfolioLoading;
    dispatch(setLoading(loading));
  }, [walletsLoading, usdLoading, valuesLoading, portfolioLoading, dispatch]);

  // Update loading state
  useEffect(() => {
    const error =
      walletsError?.message ||
      usdError?.message ||
      valuesError?.message ||
      portfolioError?.message ||
      null;
    dispatch(setError(error));
  }, [walletsError, usdError, valuesError, portfolioError, dispatch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchWallets(),
        refetchUSDWallet(),
        refetchWalletValues(),
        refetchPortfolio(),
      ]);
      toast.success("Your asset balances have been refreshed.");
    } catch (error) {
      toast.error("Failed to refresh data");
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getAssetAllocation = () => {
    if (!portfolioSummary) return [];

    const allocations = [
      {
        name: "USD",
        value: portfolioSummary.portfolio_summary.usd_balance,
        percentage: portfolioSummary.portfolio_summary.usd_percentage,
        color: "bg-green-500",
      },
      ...portfolioSummary.crypto_portfolio.map((crypto, index) => {
        const colors = [
          "bg-orange-500",
          "bg-blue-500",
          "bg-gray-500",
          "bg-purple-500",
        ];
        return {
          name: crypto.crypto_symbol,
          value: crypto.usd_value || 0,
          percentage: crypto.percentage_of_total_portfolio,
          color: colors[index % colors.length],
        };
      }),
    ];
    return allocations.filter((allocation) => allocation.value > 0);
  };

  const getCryptoWalletWithPrice = (walletId: number) => {
    return walletUSDValues.find((wv) => wv.wallet_id === walletId);
  };

  if (isLoading) {
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

  if (error && !portfolioSummary) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}. Please check your connection and try again.
          </AlertDescription>
        </Alert>
        <Button onClick={handleRefresh} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  const assetAllocations = getAssetAllocation();
  const totalPortfolioValue =
    portfolioSummary?.portfolio_summary.total_portfolio_value_usd || 0;
  const primaryUSDWallet = usdWallet[0] || null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Assets</h1>
          <p className="text-muted-foreground">
            Manage your cryptocurrency and USD wallet balances
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBalances(!showBalances)}
            className="cursor-pointer"
          >
            {showBalances ? (
              <EyeOff className="h-4 w-4 mr-2" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            {showBalances ? "Hide" : "Show"} Balances
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Some data may be outdated: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Portfolio Overview
            </CardTitle>
            <CardDescription>
              Your total asset value and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Total Portfolio Value
                  </span>
                  <div className="text-sm text-muted-foreground">Live Data</div>
                </div>
                <div className="text-3xl font-bold">
                  {showBalances
                    ? formatCurrency(totalPortfolioValue)
                    : "••••••"}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Asset Allocation</h4>
                {assetAllocations.map((allocation) => (
                  <div key={allocation.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{allocation.name}</span>
                      <div className="text-right">
                        <div>
                          {showBalances
                            ? formatCurrency(allocation.value)
                            : "••••••"}
                        </div>
                        <div className="text-muted-foreground">
                          {allocation.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <Progress value={allocation.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Manage your assets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full">
              <Link
                href="/dashboard/deposit"
                className="w-full flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Deposit Funds
              </Link>
            </Button>
            <Button className="w-full" variant="outline">
              <Link
                href="/dashboard/withdraw"
                className="w-full flex items-center justify-center"
              >
                <Minus className="h-4 w-4 mr-2" />
                Withdraw Funds
              </Link>
            </Button>
            <Button className="w-full" variant="outline">
              <Link
                href="/dashboard/hist"
                className="w-full flex items-center justify-center"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View History
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="md:grid w-full md:grid-cols-3 flex flex-wrap h-full">
          <TabsTrigger value="all">All Assets</TabsTrigger>
          <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
          <TabsTrigger value="fiat">Fiat Currency</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* USD Wallet */}
            {primaryUSDWallet && (
              <Card>
                <CardContent className="p-6">
                  <div className="md:flex md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">US Dollar</h3>
                        <p className="text-sm text-muted-foreground">USD</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {showBalances
                          ? formatCurrency(
                              Number.parseFloat(primaryUSDWallet?.balance)
                            )
                          : "••••••"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Available Balance
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Crypto Wallets */}
            {walletInfo.map((wallet, index) => {
              const walletWithPrice = getCryptoWalletWithPrice(wallet.id);
              const usdValue = walletWithPrice?.total_usd_value || 0;
              const currentPrice = walletWithPrice?.current_price_usd;

              const colors = [
                { bg: "bg-orange-100", text: "text-orange-600" },
                { bg: "bg-blue-100", text: "text-blue-600" },
                { bg: "bg-gray-100", text: "text-gray-600" },
                { bg: "bg-purple-100", text: "text-purple-600" },
              ];
              const colorScheme = colors[index % colors.length];

              return (
                <Card key={wallet.id}>
                  <CardContent className="p-6">
                    <div className="md:flex md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 ${colorScheme.bg} rounded-full flex items-center justify-center`}
                        >
                          <Image
                            src={
                              wallet.crypto_type.logo_url || "/placeholder.svg"
                            }
                            alt={wallet.crypto_type.name}
                            className="w-6 h-6"
                            width={32}
                            height={32}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {wallet.crypto_type.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">
                              {wallet.crypto_type.symbol}
                            </p>
                            {!walletWithPrice?.market_available && (
                              <Badge variant="destructive" className="text-xs">
                                No Market Data
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {showBalances
                            ? `${formatBalance(wallet.balance)} ${
                                wallet.crypto_type.symbol
                              }`
                            : "••••••"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {showBalances && walletWithPrice?.market_available
                            ? formatCurrency(usdValue)
                            : showBalances
                            ? "Price unavailable"
                            : "••••••"}
                        </div>
                        {currentPrice && (
                          <div className="text-xs text-muted-foreground mt-1">
                            @ {formatCurrency(currentPrice)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="crypto" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {walletInfo.map((wallet, index) => {
              const walletWithPrice = getCryptoWalletWithPrice(wallet.id);
              const usdValue = walletWithPrice?.total_usd_value || 0;
              const currentPrice = walletWithPrice?.current_price_usd;

              const colors = [
                { bg: "bg-orange-100", text: "text-orange-600" },
                { bg: "bg-blue-100", text: "text-blue-600" },
                { bg: "bg-gray-100", text: "text-gray-600" },
                { bg: "bg-purple-100", text: "text-purple-600" },
              ];
              const colorScheme = colors[index % colors.length];

              return (
                <Card key={wallet.id}>
                  <CardContent className="p-6">
                    <div className="md:flex md:items-center md:justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 ${colorScheme.bg} rounded-full flex items-center justify-center`}
                        >
                          <Image
                            src={
                              wallet.crypto_type.logo_url || "/placeholder.svg"
                            }
                            alt={wallet.crypto_type.name}
                            width={32}
                            height={32}
                            className="w-6 h-6"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {wallet.crypto_type.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">
                              {wallet.crypto_type.symbol}
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {wallet.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {showBalances
                            ? `${formatBalance(wallet.balance)} ${
                                wallet.crypto_type.symbol
                              }`
                            : "••••••"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {showBalances && walletWithPrice?.market_available
                            ? formatCurrency(usdValue)
                            : showBalances
                            ? "Price unavailable"
                            : "••••••"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Current Price</p>
                        {currentPrice ? (
                          <span className="font-medium">
                            {formatCurrency(currentPrice)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            Unavailable
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-muted-foreground">Wallet Address</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {wallet.wallet_address.slice(0, 8)}...
                          {wallet.wallet_address.slice(-6)}
                        </code>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Convert
                        wallets={walletInfo}
                        walletUSDValues={walletUSDValues}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="fiat" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">US Dollar</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">USD</p>
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {showBalances
                      ? formatCurrency(
                          Number.parseFloat(primaryUSDWallet?.balance)
                        )
                      : "••••••"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Available Balance
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground">Account Type</p>
                  <p className="font-medium">USD Wallet</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {new Date(
                      primaryUSDWallet?.created_at
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Convert
                  wallets={walletInfo}
                  walletUSDValues={walletUSDValues}
                  usdWallet={primaryUSDWallet}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
