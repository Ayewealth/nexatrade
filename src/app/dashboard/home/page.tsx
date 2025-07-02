"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/redux/store";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  getPortfolioSummary,
  getSubscriptions,
  getTrades,
  getTransactionHistory,
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
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Copy,
  DollarSign,
  Activity,
  PieChart,
  BarChart3,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Target,
  Shield,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Convert from "../_components/convert";
import { formatBalance } from "@/utils/wallet";
import { setTransactionHistoryInfo } from "@/lib/redux/slice/transactionSlice";
import { setTrade } from "@/lib/redux/slice/tradingSlice";
import { setSubscriptions } from "@/lib/redux/slice/investmentSlice";
import { getUserProfile } from "@/utils/queries";
import { setUserInfo } from "@/lib/redux/slice/authSlice";

// Mock data based on your models
const mockUser = {
  email: "johndoe@gmail.com",
  first_name: "John",
  last_name: "Doe",
  uid: "35403204",
  last_login: "2024-01-15T16:13:15Z",
  avatar: "/placeholder.svg?height=120&width=120",
  kyc_status: "verified",
};

const formatCurrency = (amount: string | number) => {
  const numAmount =
    typeof amount === "string" ? Number.parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

const Page = () => {
  const dispatch = useDispatch();
  const [showBalances, setShowBalances] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { trades } = useAppSelector((state) => state.trading);
  const { transactionHistoryInfo } = useAppSelector(
    (state) => state.transactionHistory
  );
  const {
    walletInfo,
    usdWallet,
    isLoading,
    error,
    portfolioSummary,
    walletUSDValues,
  } = useAppSelector((state) => state.wallet);
  const { subscriptions } = useAppSelector((state) => state.investment);
  const { userInfo } = useAppSelector((state) => state.auth);

  const totalInvestments = subscriptions?.reduce(
    (sum, inv) => sum + Number.parseFloat(inv.investment_amount),
    0
  );

  const totalExpectedProfit = subscriptions?.reduce(
    (sum, inv) => sum + Number.parseFloat(inv.expected_profit),
    0
  );

  const totalTradeProfit = trades?.reduce(
    (sum, trade) => sum + Number.parseFloat(trade.current_profit),
    0
  );

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

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

  const {
    data: transactionHistory,
    refetch: refreshTransactionHistory,
    isLoading: transactionHistoryLoading,
  } = useQuery({
    queryKey: ["transactionHistory"],
    queryFn: getTransactionHistory,
  });

  const {
    data: tradeData,
    refetch: refreshTradeData,
    isLoading: tradesLoading,
  } = useQuery({
    queryKey: ["trades"],
    queryFn: getTrades,
    refetchInterval: 5000,
  });

  const {
    data: subscriptionsData,
    refetch: refreshSubscriptions,
    isLoading: subscriptionsLoading,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
    refetchInterval: 5000,
  });

  const {
    data: userProfileData,
    refetch: refreshUserProfileData,
    isLoading: userProfileLoading,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
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
    if (transactionHistory) {
      dispatch(
        setTransactionHistoryInfo({
          transactionHistoryData: transactionHistory,
        })
      );
    }
    if (tradeData) {
      dispatch(setTrade({ tradeData: tradeData }));
    }
    if (subscriptionsData) {
      dispatch(setSubscriptions({ subscriptionData: subscriptionsData }));
    }
    if (userProfileData) {
      setUserInfo({
        userData: {
          id: userProfileData.id,
          profile_pic: userProfileData.profile_pic,
          username: userProfileData.username,
          email: userProfileData.email,
          full_name: userProfileData.full_name,
          phone_number: userProfileData.phone_number,
          address: userProfileData.address,
          date_of_birth: userProfileData.date_of_birth,
          kyc_status: userProfileData.kyc_status,
          is_staff: userProfileData.is_staff,
        },
      });
    }
  }, [
    wallets,
    usdWalletData,
    walletValuesData,
    portfolioData,
    transactionHistory,
    tradeData,
    subscriptionsData,
    userProfileData,
    dispatch,
  ]);

  // Update loading state
  useEffect(() => {
    const loading =
      walletsLoading ||
      usdLoading ||
      valuesLoading ||
      portfolioLoading ||
      transactionHistoryLoading ||
      tradesLoading ||
      subscriptionsLoading ||
      userProfileLoading;
    dispatch(setLoading(loading));
  }, [
    walletsLoading,
    usdLoading,
    valuesLoading,
    portfolioLoading,
    transactionHistoryLoading,
    tradesLoading,
    subscriptionsLoading,
    userProfileLoading,
    dispatch,
  ]);

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
        refreshTransactionHistory(),
        refreshTradeData(),
        refreshSubscriptions(),
        refreshUserProfileData(),
      ]);
      toast.success("Your asset balances have been refreshed.");
    } catch (error) {
      toast.error("Failed to refresh data");
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
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

  const totalPortfolioValue =
    portfolioSummary?.portfolio_summary.total_portfolio_value_usd || 0;
  const primaryUSDWallet = usdWallet[0] || null;

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* User Profile & Portfolio Overview */}
        <div className="lg:w-3/4">
          <Card className="h-full">
            <CardContent className="p-6">
              {/* User Profile */}
              <div className="flex items-center gap-4 mb-6 md:flex-row flex-col">
                <div className="relative">
                  <div className="w-[125px] h-[125px] rounded-full overflow-hidden border-2 border-white mb-[20px]">
                    <Image
                      src={
                        userInfo.userData.profile_pic || "/assets/default.jpg"
                      }
                      alt="User Avatar"
                      width={125}
                      height={125}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  {userInfo.userData.kyc_status === "verified" && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                      <Shield className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-1">
                  <div className="flex-1">
                    <h2 className="md:text-2xl text-xl font-bold">
                      Hello, {userInfo.userData.full_name}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      User Name: {userInfo.userData.username}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        UID:
                      </span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {userInfo.userData.id}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          copyToClipboard(userInfo.userData.id.toString());
                          toast.success("UID copied to clipboard");
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBalances(!showBalances)}
                    >
                      {showBalances ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          isRefreshing ? "animate-spin" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Portfolio Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">
                      Total Portfolio Value
                    </h3>
                  </div>
                  <div className="text-4xl font-bold mb-2">
                    {showBalances
                      ? formatCurrency(totalPortfolioValue)
                      : "••••••"}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Investments
                      </p>
                      <p className="text-lg font-bold">
                        {showBalances
                          ? formatCurrency(totalInvestments)
                          : "••••"}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Trade P&L</p>
                      <p
                        className={`text-lg font-bold ${
                          totalTradeProfit >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {showBalances
                          ? formatCurrency(totalTradeProfit)
                          : "••••"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:w-1/4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>
                Get started with trading and investing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-pink-300 to-rose-500 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-white" />
                    <span className="font-semibold text-white">Deposit</span>
                  </div>
                </div>
                <p className="text-white text-sm mb-3">
                  Add funds to start trading
                </p>
                <Link href="/dashboard/deposit">
                  <Button
                    size="sm"
                    className="bg-white text-black hover:bg-gray-100"
                  >
                    Deposit Now
                  </Button>
                </Link>
              </div>

              <div className="bg-gradient-to-r from-green-300 to-green-500 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-white" />
                    <span className="font-semibold text-white">Trade</span>
                  </div>
                </div>
                <p className="text-white text-sm mb-3">
                  Start trading cryptocurrencies
                </p>
                <Link href="/dashboard/trade">
                  <Button
                    size="sm"
                    className="bg-white text-black hover:bg-gray-100"
                  >
                    Trade Now
                  </Button>
                </Link>
              </div>

              <div className="bg-gradient-to-r from-blue-300 to-blue-500 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-white" />
                    <span className="font-semibold text-white">Invest</span>
                  </div>
                </div>
                <p className="text-white text-sm mb-3">Auto-trading packages</p>
                <Link href="/dashboard/invest">
                  <Button
                    size="sm"
                    className="bg-white text-black hover:bg-gray-100"
                  >
                    Invest Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:grid-cols-5 grid-cols-3 h-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="trades">Active Trades</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Balance
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {showBalances
                    ? formatCurrency(totalPortfolioValue)
                    : "••••••"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Investments
                </CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    subscriptions.filter((sub) => sub.status === "active")
                      .length
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  {showBalances ? formatCurrency(totalExpectedProfit) : "••••"}{" "}
                  expected profit
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Open Trades
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trades?.length}</div>
                <p
                  className={`text-xs ${
                    totalTradeProfit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {showBalances ? formatCurrency(totalTradeProfit) : "••••"} P&L
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  USD Wallet
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {showBalances
                    ? formatCurrency(primaryUSDWallet?.balance)
                    : "••••••"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Available for trading
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest transactions and trades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactionHistoryInfo.transactionHistoryData
                  .slice(0, 5)
                  .map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            transaction.transaction_type === "deposit"
                              ? "bg-green-100"
                              : transaction.transaction_type === "withdrawal"
                              ? "bg-red-100"
                              : "bg-blue-100"
                          }`}
                        >
                          {transaction.transaction_type === "deposit" ? (
                            <ArrowDownLeft className="h-4 w-4 text-green-600" />
                          ) : transaction.transaction_type === "withdrawal" ? (
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          ) : (
                            <Activity className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium capitalize">
                            {transaction.transaction_type}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(
                              transaction.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {showBalances
                            ? `${transaction.amount} ${transaction?.crypto_wallet}`
                            : "••••••"}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallets" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* USD Wallet */}
            <Card>
              <CardContent className="p-6">
                <div className="md:flex md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">US Dollar</h3>
                      <p className="text-sm text-muted-foreground">
                        USD Wallet
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {showBalances
                        ? formatCurrency(primaryUSDWallet?.balance)
                        : "••••••"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Available Balance
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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

        <TabsContent value="trades" className="space-y-6">
          <div className="grid gap-4">
            {trades
              ?.filter((trade) => trade.status === "open")
              .map((trade) => (
                <Card key={trade.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{trade.market.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              trade.trade_type === "buy"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {trade.trade_type.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {showBalances ? trade.amount : "••••••"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${
                            Number.parseFloat(trade.current_profit) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {showBalances
                            ? formatCurrency(trade.current_profit)
                            : "••••••"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="investments" className="space-y-6">
          <div className="grid gap-4">
            {subscriptions?.map((investment) => (
              <Card key={investment.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">
                        {investment.package.name}
                      </h3>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Investment</p>
                        <p className="font-semibold">
                          {showBalances
                            ? formatCurrency(investment.investment_amount)
                            : "••••••"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expected Profit</p>
                        <p className="font-semibold text-green-600">
                          {showBalances
                            ? formatCurrency(investment.expected_profit)
                            : "••••••"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Progress</p>
                        <p className="font-semibold">
                          {investment.profit_progress_percentage}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Days Remaining</p>
                        <p className="font-semibold">
                          {calculateDaysRemaining(investment.end_date)} days
                        </p>
                      </div>
                    </div>
                    <Progress
                      value={investment.profit_progress_percentage}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Complete history of your account activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactionHistoryInfo.transactionHistoryData.map(
                  (transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg md:flex-row flex-col gap-2 md:gap-0"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-full ${
                            transaction?.transaction_type === "deposit"
                              ? "bg-green-100"
                              : transaction?.transaction_type === "withdrawal"
                              ? "bg-red-100"
                              : "bg-blue-100"
                          }`}
                        >
                          {transaction?.transaction_type === "deposit" ? (
                            <ArrowDownLeft className="h-5 w-5 text-green-600" />
                          ) : transaction?.transaction_type === "withdrawal" ? (
                            <ArrowUpRight className="h-5 w-5 text-red-600" />
                          ) : (
                            <Activity className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium capitalize">
                            {transaction?.transaction_type}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleString()}
                          </p>
                          <Badge variant="outline" className="mt-1">
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-lg">
                          {showBalances
                            ? `${transaction.amount} ${transaction?.crypto_wallet}`
                            : "••••••"}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
