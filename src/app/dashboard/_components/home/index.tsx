"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
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
  Minus,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

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

const mockCryptoWallets = [
  {
    id: 1,
    crypto_type: {
      name: "Bitcoin",
      symbol: "BTC",
      logo_url: "/placeholder.svg?height=32&width=32",
      current_price: 43250.75,
      price_change_24h: 2.34,
    },
    balance: "0.10543210",
    usd_value: 4567.89,
  },
  {
    id: 2,
    crypto_type: {
      name: "Ethereum",
      symbol: "ETH",
      logo_url: "/placeholder.svg?height=32&width=32",
      current_price: 2650.4,
      price_change_24h: -1.28,
    },
    balance: "2.50000000",
    usd_value: 6626.0,
  },
  {
    id: 3,
    crypto_type: {
      name: "Litecoin",
      symbol: "LTC",
      logo_url: "/placeholder.svg?height=32&width=32",
      current_price: 72.15,
      price_change_24h: 0.85,
    },
    balance: "15.00000000",
    usd_value: 1082.25,
  },
];

const mockUsdWallet = {
  balance: "12500.75",
};

const mockRecentTransactions = [
  {
    id: 1,
    type: "deposit",
    amount: "0.05000000",
    symbol: "BTC",
    usd_value: 2162.54,
    status: "completed",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    type: "withdrawal",
    amount: "1000.00",
    symbol: "USD",
    usd_value: 1000.0,
    status: "pending",
    created_at: "2024-01-15T09:15:00Z",
  },
  {
    id: 3,
    type: "trade",
    amount: "0.02000000",
    symbol: "ETH",
    usd_value: 530.08,
    status: "completed",
    created_at: "2024-01-15T08:45:00Z",
  },
];

const mockActiveInvestments = [
  {
    id: 1,
    package_name: "Growth Package",
    investment_amount: "2000.00",
    expected_profit: "240.00",
    progress: 65,
    days_remaining: 21,
  },
  {
    id: 2,
    package_name: "Premium Package",
    investment_amount: "5000.00",
    expected_profit: "1250.00",
    progress: 30,
    days_remaining: 63,
  },
];

const mockOpenTrades = [
  {
    id: 1,
    market: "BTC/USD",
    type: "buy",
    amount: "0.05000000",
    current_profit: "125.50",
    profit_percentage: 2.75,
  },
  {
    id: 2,
    market: "ETH/USD",
    type: "sell",
    amount: "1.00000000",
    current_profit: "-45.20",
    profit_percentage: -1.71,
  },
];

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

const formatCrypto = (balance: string, symbol: string) => {
  const numBalance = Number.parseFloat(balance);
  return `${numBalance.toFixed(8)} ${symbol}`;
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export default function DashboardHome() {
  const [showBalances, setShowBalances] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const [showConversionDialog, setShowConversionDialog] = useState(false);
  const [conversionType, setConversionType] = useState<
    "crypto-to-usd" | "usd-to-crypto"
  >("crypto-to-usd");
  const [selectedWallet, setSelectedWallet] = useState<any>(null);

  const totalPortfolioValue =
    mockCryptoWallets.reduce((sum, wallet) => sum + wallet.usd_value, 0) +
    Number.parseFloat(mockUsdWallet.balance);

  const totalInvestments = mockActiveInvestments.reduce(
    (sum, inv) => sum + Number.parseFloat(inv.investment_amount),
    0
  );

  const totalExpectedProfit = mockActiveInvestments.reduce(
    (sum, inv) => sum + Number.parseFloat(inv.expected_profit),
    0
  );

  const totalTradeProfit = mockOpenTrades.reduce(
    (sum, trade) => sum + Number.parseFloat(trade.current_profit),
    0
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast.success("Your dashboard data has been refreshed.");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* User Profile & Portfolio Overview */}
        <div className="lg:w-3/4">
          <Card className="h-full">
            <CardContent className="p-6">
              {/* User Profile */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <Image
                    src={mockUser.avatar || "/placeholder.svg"}
                    alt="User Avatar"
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                  {mockUser.kyc_status === "verified" && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                      <Shield className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">
                    Hello, {mockUser.first_name} {mockUser.last_name}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Last Login: {new Date(mockUser.last_login).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">UID:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {mockUser.uid}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        copyToClipboard(mockUser.uid);
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

              {/* Portfolio Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">
                      Total Portfolio Value
                    </h3>
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="text-sm bg-muted rounded px-2 py-1"
                    >
                      <option value="USD">USD</option>
                      <option value="BTC">BTC</option>
                      <option value="ETH">ETH</option>
                    </select>
                  </div>
                  <div className="text-4xl font-bold mb-2">
                    {showBalances
                      ? formatCurrency(totalPortfolioValue)
                      : "••••••"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>+2.34% (24h)</span>
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
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-gray-100"
                >
                  Deposit Now
                </Button>
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
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-gray-100"
                >
                  Trade Now
                </Button>
              </div>

              <div className="bg-gradient-to-r from-blue-300 to-blue-500 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-white" />
                    <span className="font-semibold text-white">Invest</span>
                  </div>
                </div>
                <p className="text-white text-sm mb-3">Auto-trading packages</p>
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-gray-100"
                >
                  Invest Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
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
                <p className="text-xs text-muted-foreground">
                  +2.34% from yesterday
                </p>
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
                  {mockActiveInvestments.length}
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
                <div className="text-2xl font-bold">
                  {mockOpenTrades.length}
                </div>
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
                    ? formatCurrency(mockUsdWallet.balance)
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
                {mockRecentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === "deposit"
                            ? "bg-green-100"
                            : transaction.type === "withdrawal"
                            ? "bg-red-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {transaction.type === "deposit" ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-600" />
                        ) : transaction.type === "withdrawal" ? (
                          <ArrowUpRight className="h-4 w-4 text-red-600" />
                        ) : (
                          <Activity className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium capitalize">
                          {transaction.type}
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
                          ? `${transaction.amount} ${transaction.symbol}`
                          : "••••••"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {showBalances
                          ? formatCurrency(transaction.usd_value)
                          : "••••"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallets" className="space-y-6">
          <div className="grid gap-6">
            {/* USD Wallet */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
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
                        ? formatCurrency(mockUsdWallet.balance)
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
            {mockCryptoWallets.map((wallet) => (
              <Card key={wallet.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Image
                        src={wallet.crypto_type.logo_url || "/placeholder.svg"}
                        alt={wallet.crypto_type.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {wallet.crypto_type.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            {wallet.crypto_type.symbol}
                          </p>
                          <div className="flex items-center gap-1">
                            {wallet.crypto_type.price_change_24h >= 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                            <span
                              className={`text-xs ${
                                wallet.crypto_type.price_change_24h >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {wallet.crypto_type.price_change_24h >= 0
                                ? "+"
                                : ""}
                              {wallet.crypto_type.price_change_24h.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {showBalances
                          ? formatCrypto(
                              wallet.balance,
                              wallet.crypto_type.symbol
                            )
                          : "••••••"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {showBalances
                          ? formatCurrency(wallet.usd_value)
                          : "••••••"}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Deposit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Minus className="h-4 w-4 mr-2" />
                      Withdraw
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedWallet(wallet);
                        setConversionType("crypto-to-usd");
                        setShowConversionDialog(true);
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Convert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trades" className="space-y-6">
          <div className="grid gap-4">
            {mockOpenTrades.map((trade) => (
              <Card key={trade.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{trade.market}</h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            trade.type === "buy" ? "default" : "destructive"
                          }
                        >
                          {trade.type.toUpperCase()}
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
                      <div
                        className={`text-sm ${
                          trade.profit_percentage >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {trade.profit_percentage >= 0 ? "+" : ""}
                        {trade.profit_percentage.toFixed(2)}%
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
            {mockActiveInvestments.map((investment) => (
              <Card key={investment.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">
                        {investment.package_name}
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
                        <p className="font-semibold">{investment.progress}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Days Remaining</p>
                        <p className="font-semibold">
                          {investment.days_remaining} days
                        </p>
                      </div>
                    </div>
                    <Progress value={investment.progress} className="h-2" />
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
                {mockRecentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-full ${
                          transaction.type === "deposit"
                            ? "bg-green-100"
                            : transaction.type === "withdrawal"
                            ? "bg-red-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {transaction.type === "deposit" ? (
                          <ArrowDownLeft className="h-5 w-5 text-green-600" />
                        ) : transaction.type === "withdrawal" ? (
                          <ArrowUpRight className="h-5 w-5 text-red-600" />
                        ) : (
                          <Activity className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium capitalize">
                          {transaction.type}
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
                          ? `${transaction.amount} ${transaction.symbol}`
                          : "••••••"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {showBalances
                          ? formatCurrency(transaction.usd_value)
                          : "••••"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
