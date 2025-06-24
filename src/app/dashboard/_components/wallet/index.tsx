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
  Minus,
  PieChart,
  BarChart3,
  DollarSign,
  Activity,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

// Mock data based on your models
const mockCryptoTypes = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    logo_url: "/placeholder.svg?height=32&width=32",
    is_active: true,
    current_price: 43250.75,
    price_change_24h: 2.34,
  },
  {
    id: 2,
    name: "Ethereum",
    symbol: "ETH",
    logo_url: "/placeholder.svg?height=32&width=32",
    is_active: true,
    current_price: 2650.4,
    price_change_24h: -1.28,
  },
  {
    id: 3,
    name: "Litecoin",
    symbol: "LTC",
    logo_url: "/placeholder.svg?height=32&width=32",
    is_active: true,
    current_price: 72.15,
    price_change_24h: 0.85,
  },
  {
    id: 4,
    name: "Cardano",
    symbol: "ADA",
    logo_url: "/placeholder.svg?height=32&width=32",
    is_active: true,
    current_price: 0.48,
    price_change_24h: -3.12,
  },
];

const mockCryptoWallets = [
  {
    id: 1,
    crypto_type: mockCryptoTypes[0],
    balance: "0.05432100",
    wallet_address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    is_active: true,
  },
  {
    id: 2,
    crypto_type: mockCryptoTypes[1],
    balance: "1.25000000",
    wallet_address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    is_active: true,
  },
  {
    id: 3,
    crypto_type: mockCryptoTypes[2],
    balance: "10.00000000",
    wallet_address: "LTC1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    is_active: true,
  },
  {
    id: 4,
    crypto_type: mockCryptoTypes[3],
    balance: "500.00000000",
    wallet_address: "addr1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    is_active: true,
  },
];

const mockUsdWallet = {
  id: 6,
  user: 8,
  balance: "12500.75",
  is_active: true,
  created_at: "2025-06-13T00:09:07.022055Z",
};

const formatBalance = (balance: string, decimals = 8) => {
  const numBalance = Number.parseFloat(balance);
  return numBalance.toFixed(decimals);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const calculateUSDValue = (balance: string, price: number) => {
  return Number.parseFloat(balance) * price;
};

const calculateTotalPortfolioValue = () => {
  const cryptoValue = mockCryptoWallets.reduce((total, wallet) => {
    return (
      total +
      calculateUSDValue(wallet.balance, wallet.crypto_type.current_price)
    );
  }, 0);
  const usdValue = Number.parseFloat(mockUsdWallet.balance);
  return cryptoValue + usdValue;
};

const calculatePortfolioChange = () => {
  // Mock 24h portfolio change
  return 1.85; // 1.85% increase
};

export default function MyAssets() {
  const [showBalances, setShowBalances] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalPortfolioValue = calculateTotalPortfolioValue();
  const portfolioChange = calculatePortfolioChange();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast("Your asset balances have been refreshed.");
  };

  const getAssetAllocation = () => {
    const total = totalPortfolioValue;
    const allocations = [
      {
        name: "USD",
        value: Number.parseFloat(mockUsdWallet.balance),
        percentage: (Number.parseFloat(mockUsdWallet.balance) / total) * 100,
        color: "bg-green-500",
      },
      ...mockCryptoWallets.map((wallet, index) => {
        const value = calculateUSDValue(
          wallet.balance,
          wallet.crypto_type.current_price
        );
        const colors = [
          "bg-orange-500",
          "bg-blue-500",
          "bg-gray-500",
          "bg-purple-500",
        ];
        return {
          name: wallet.crypto_type.symbol,
          value,
          percentage: (value / total) * 100,
          color: colors[index % colors.length],
        };
      }),
    ];
    return allocations.filter((allocation) => allocation.value > 0);
  };

  const assetAllocations = getAssetAllocation();

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
                  <div className="flex items-center gap-2">
                    {portfolioChange >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        portfolioChange >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {portfolioChange >= 0 ? "+" : ""}
                      {portfolioChange.toFixed(2)}% (24h)
                    </span>
                  </div>
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
            <Button className="w-full justify-start" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Deposit Funds
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Minus className="h-4 w-4 mr-2" />
              Withdraw Funds
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              View History
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Auto-Refresh: Off
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Assets</TabsTrigger>
          <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
          <TabsTrigger value="fiat">Fiat Currency</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
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
                      <p className="text-sm text-muted-foreground">USD</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {showBalances
                        ? formatCurrency(
                            Number.parseFloat(mockUsdWallet.balance)
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

            {/* Crypto Wallets */}
            {mockCryptoWallets.map((wallet, index) => {
              const usdValue = calculateUSDValue(
                wallet.balance,
                wallet.crypto_type.current_price
              );
              const priceChange = wallet.crypto_type.price_change_24h;
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
                    <div className="flex items-center justify-between">
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
                            <div className="flex items-center gap-1">
                              {priceChange >= 0 ? (
                                <TrendingUp className="h-3 w-3 text-green-600" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-600" />
                              )}
                              <span
                                className={`text-xs ${
                                  priceChange >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {priceChange >= 0 ? "+" : ""}
                                {priceChange.toFixed(2)}%
                              </span>
                            </div>
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
                          {showBalances ? formatCurrency(usdValue) : "••••••"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          @ {formatCurrency(wallet.crypto_type.current_price)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="crypto" className="space-y-4">
          <div className="grid gap-4">
            {mockCryptoWallets.map((wallet, index) => {
              const usdValue = calculateUSDValue(
                wallet.balance,
                wallet.crypto_type.current_price
              );
              const priceChange = wallet.crypto_type.price_change_24h;
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
                    <div className="flex items-center justify-between mb-4">
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
                              Active
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
                          {showBalances ? formatCurrency(usdValue) : "••••••"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Current Price</p>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {formatCurrency(wallet.crypto_type.current_price)}
                          </span>
                          <div className="flex items-center gap-1">
                            {priceChange >= 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                            <span
                              className={`text-xs ${
                                priceChange >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {priceChange >= 0 ? "+" : ""}
                              {priceChange.toFixed(2)}%
                            </span>
                          </div>
                        </div>
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
                      <Button size="sm" variant="outline" className="flex-1">
                        <Plus className="h-4 w-4 mr-2" />
                        Deposit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Minus className="h-4 w-4 mr-2" />
                        Withdraw
                      </Button>
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
                      ? formatCurrency(Number.parseFloat(mockUsdWallet.balance))
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
                    {new Date(mockUsdWallet.created_at).toLocaleDateString()}
                  </p>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
