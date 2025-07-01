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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  DollarSign,
  Target,
  Shield,
  CheckCircle,
  AlertTriangle,
  PieChart,
  Activity,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppSelector } from "@/lib/redux/store";
import { useSubscribe } from "@/hooks/auth";

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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getRiskColor = (risk: string) => {
  switch (risk.toLowerCase()) {
    case "low":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "very high":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getProgressColor = (percentage: number) => {
  if (percentage >= 90) return "bg-green-500";
  if (percentage >= 60) return "bg-blue-500";
  if (percentage >= 30) return "bg-yellow-500";
  return "bg-gray-400";
};

const calculateDaysRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export default function Investment() {
  const [selectedPackage, setSelectedPackage] = useState<
    (typeof packages)[0] | null
  >(null);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [showInvestDialog, setShowInvestDialog] = useState(false);

  const { usdWallet } = useAppSelector((state) => state.wallet);
  const { packages, subscriptions } = useAppSelector(
    (state) => state.investment
  );

  const primaryUSDWallet = usdWallet[0] || null;

  const { mutateAsync, isPending } = useSubscribe();

  const calculateExpectedProfit = () => {
    if (!selectedPackage || !investmentAmount) return 0;
    const amount = Number.parseFloat(investmentAmount);
    const profitPercentage = Number.parseFloat(
      selectedPackage.profit_percentage
    );
    return (amount * profitPercentage) / 100;
  };

  const calculateTotalReturn = () => {
    if (!investmentAmount) return 0;
    const amount = Number.parseFloat(investmentAmount);
    const profit = calculateExpectedProfit();
    return amount + profit;
  };

  const handleInvestment = async () => {
    if (!selectedPackage) {
      toast.error("Please select an investment package");
      return;
    }

    const amount = Number.parseFloat(investmentAmount);
    const minInvestment = Number.parseFloat(selectedPackage.min_investment);
    const maxInvestment = Number.parseFloat(selectedPackage.max_investment);

    if (amount < minInvestment || amount > maxInvestment) {
      toast.error(
        `Investment must be between ${formatCurrency(
          minInvestment
        )} and ${formatCurrency(maxInvestment)}`
      );
      return;
    }

    if (amount > Number.parseFloat(primaryUSDWallet?.balance)) {
      toast.error("You don't have enough USD balance for this investment");
      return;
    }

    try {
      await mutateAsync({
        package_id: selectedPackage.id,
        investment_amount: investmentAmount,
      });

      toast.success(
        `You have successfully invested ${formatCurrency(
          investmentAmount
        )} in ${selectedPackage.name}`
      );

      // Reset form
      setInvestmentAmount("");
      setShowInvestDialog(false);
    } catch (error) {
      toast.error("Failed to connect to server. Please try again.");
      console.error("Investment error:", error);
    }
  };

  const totalActiveInvestments = subscriptions
    .filter((sub) => sub.status === "active")
    .reduce((sum, sub) => sum + Number.parseFloat(sub.investment_amount), 0);

  const totalExpectedProfit = subscriptions
    .filter((sub) => sub.status === "active")
    .reduce((sum, sub) => sum + Number.parseFloat(sub.expected_profit), 0);

  const totalProfitEarned = subscriptions.reduce(
    (sum, sub) => sum + Number.parseFloat(sub.total_profit_earned),
    0
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Investment Center
          </h1>
          <p className="text-muted-foreground">
            Automated trading packages for hands-off cryptocurrency investment
          </p>
        </div>
        <div className="flex items-center gap-4 lg:flex-row flex-col-reverse">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-lg font-bold">
              {formatCurrency(primaryUSDWallet?.balance)}
            </p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Auto Trading
          </Badge>
        </div>
      </div>

      {/* Investment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invested
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalActiveInvestments)}
            </div>
            <p className="text-xs text-muted-foreground">Active investments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalProfitEarned)}
            </div>
            <p className="text-xs text-muted-foreground">From all packages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Expected Profit
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalExpectedProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              From active packages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Packages
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptions.filter((sub) => sub.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="md:grid w-full md:grid-cols-3 flex flex-wrap h-full bg-card">
          <TabsTrigger value="packages" className="cursor-pointer bg-card">
            Available Packages
          </TabsTrigger>
          <TabsTrigger value="investments" className="cursor-pointer bg-card">
            My Investments
          </TabsTrigger>
          <TabsTrigger value="trading" className="cursor-pointer bg-card">
            Auto Trading
          </TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <Badge className={getRiskColor(pkg.risk_level)}>
                      {pkg.risk_level} Risk
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {pkg.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {pkg.profit_percentage}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Expected Return
                      </p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">{pkg.duration_days}</p>
                      <p className="text-xs text-muted-foreground">Days</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Min Investment:</span>
                      <span className="font-medium">
                        {formatCurrency(pkg.min_investment)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Max Investment:</span>
                      <span className="font-medium">
                        {formatCurrency(pkg.max_investment)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Features:</p>
                    <ul className="text-xs space-y-1">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Dialog
                    open={showInvestDialog}
                    onOpenChange={setShowInvestDialog}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="w-full cursor-pointer"
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setShowInvestDialog(true);
                        }}
                      >
                        Invest Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          Invest in {selectedPackage?.name}
                        </DialogTitle>
                        <DialogDescription>
                          {selectedPackage?.profit_percentage}% return over{" "}
                          {selectedPackage?.duration_days} days
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="investment-amount">
                            Investment Amount (USD)
                          </Label>
                          <Input
                            id="investment-amount"
                            type="number"
                            placeholder="0.00"
                            value={investmentAmount}
                            onChange={(e) =>
                              setInvestmentAmount(e.target.value)
                            }
                            min={selectedPackage?.min_investment}
                            max={selectedPackage?.max_investment}
                            step="0.01"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Min:{" "}
                            {formatCurrency(
                              selectedPackage?.min_investment || "0"
                            )}{" "}
                            • Max:{" "}
                            {formatCurrency(
                              selectedPackage?.max_investment || "0"
                            )}
                          </p>
                        </div>

                        {investmentAmount && selectedPackage && (
                          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Investment Amount:</span>
                              <span className="font-mono">
                                {formatCurrency(investmentAmount)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Expected Profit:</span>
                              <span className="font-mono text-green-600">
                                +{formatCurrency(calculateExpectedProfit())}
                              </span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span>Total Return:</span>
                              <span className="font-mono">
                                {formatCurrency(calculateTotalReturn())}
                              </span>
                            </div>
                          </div>
                        )}

                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Investment returns are not guaranteed. Automated
                            trading involves risk.
                          </AlertDescription>
                        </Alert>

                        <Button
                          onClick={handleInvestment}
                          disabled={
                            isPending || !investmentAmount || !selectedPackage
                          }
                          className="w-full"
                        >
                          {isPending
                            ? "Processing Investment..."
                            : `Invest ${formatCurrency(
                                investmentAmount || "0"
                              )}`}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="investments" className="space-y-6">
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {subscription.package.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {subscription.package.duration_days} days •{" "}
                        {subscription.package.profit_percentage}% return
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(subscription.status)}>
                        {subscription.status.charAt(0).toUpperCase() +
                          subscription.status.slice(1)}
                      </Badge>
                      <Badge
                        className={getRiskColor(
                          subscription.package.risk_level
                        )}
                      >
                        {subscription.package.risk_level} Risk
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Investment
                      </p>
                      <p className="font-semibold">
                        {formatCurrency(subscription.investment_amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Profit Earned
                      </p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(subscription.total_profit_earned)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Expected Profit
                      </p>
                      <p className="font-semibold">
                        {formatCurrency(subscription.expected_profit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Days Remaining
                      </p>
                      <p className="font-semibold flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {calculateDaysRemaining(subscription.end_date)}
                      </p>
                    </div>
                  </div>

                  {subscription.status === "active" && (
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress to Target</span>
                        <span>
                          {subscription.profit_progress_percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                            subscription.profit_progress_percentage
                          )}`}
                          style={{
                            width: `${Math.min(
                              subscription.profit_progress_percentage,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {subscription.status === "completed" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          Investment Completed
                        </span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Total return:{" "}
                        {formatCurrency(
                          Number.parseFloat(subscription.investment_amount) +
                            Number.parseFloat(subscription.total_profit_earned)
                        )}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {subscriptions.length === 0 && (
              <div className="text-center py-12">
                <PieChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Investments Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start your investment journey with our automated trading
                  packages
                </p>
                <Button
                  onClick={() =>
                    (
                      document.querySelector(
                        '[value="packages"]'
                      ) as HTMLElement | null
                    )?.click()
                  }
                >
                  Browse Packages
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="trading" className="space-y-6">
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id}>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">
                        {subscription.package.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={getRiskColor(
                          subscription.package.risk_level
                        )}
                      >
                        {subscription.package.risk_level} Risk
                      </Badge>
                      <Badge className={getStatusColor(subscription.status)}>
                        {subscription.status.charAt(0).toUpperCase() +
                          subscription.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* Grid layout - responsive columns */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Investment
                      </p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(subscription.investment_amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Profit Earned
                      </p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(subscription.total_profit_earned)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Expected Profit
                      </p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(subscription.expected_profit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Days Remaining
                      </p>
                      <p className="text-lg font-semibold flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {calculateDaysRemaining(subscription.end_date)}
                      </p>
                    </div>
                  </div>

                  {/* Recent Trades */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        Recent Auto Trades
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-6">
                      {/* Mobile Card View - Hidden on larger screens */}
                      <div className="block sm:hidden">
                        {subscription.auto_trades.length === 0 ? (
                          <p className="text-center text-gray-500 py-8 px-4">
                            No trades yet. Auto-trading will begin shortly.
                          </p>
                        ) : (
                          <div className="space-y-3 p-4">
                            {subscription.auto_trades
                              .slice(0, 5)
                              .map((autoTrade) => (
                                <div
                                  key={autoTrade.id}
                                  className="bg-background rounded-lg p-3 space-y-2"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium text-sm">
                                        {autoTrade.trade.market.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {formatDate(autoTrade.trade.created_at)}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${
                                          autoTrade.trade.trade_type === "buy"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                      >
                                        {autoTrade.trade.trade_type.toUpperCase()}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                      <span className="text-muted-foreground">
                                        Amount:
                                      </span>
                                      <span className="ml-1 font-medium">
                                        {autoTrade.trade.amount}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">
                                        Price:
                                      </span>
                                      <span className="ml-1 font-medium">
                                        {formatCurrency(autoTrade.trade.price)}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">
                                        P/L:
                                      </span>
                                      <span
                                        className={`ml-1 font-medium ${
                                          Number(
                                            autoTrade.trade.current_profit
                                          ) >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`}
                                      >
                                        {autoTrade.trade.status === "open"
                                          ? "-"
                                          : formatCurrency(
                                              autoTrade.trade.current_profit
                                            )}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">
                                        Status:
                                      </span>
                                      <span
                                        className={`ml-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                                          autoTrade.trade.status === "open"
                                            ? "bg-blue-100 text-blue-700"
                                            : autoTrade.trade.status ===
                                              "closed"
                                            ? "bg-gray-100 text-gray-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                      >
                                        {autoTrade.trade.status
                                          .charAt(0)
                                          .toUpperCase() +
                                          autoTrade.trade.status.slice(1)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* Desktop Table View - Hidden on mobile */}
                      <div className="hidden sm:block">
                        <div className="overflow-x-auto -mx-6 sm:mx-0">
                          <div className="inline-block min-w-full align-middle">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="whitespace-nowrap">
                                    Market
                                  </TableHead>
                                  <TableHead className="whitespace-nowrap">
                                    Type
                                  </TableHead>
                                  <TableHead className="whitespace-nowrap">
                                    Amount
                                  </TableHead>
                                  <TableHead className="whitespace-nowrap">
                                    Entry Price
                                  </TableHead>
                                  <TableHead className="whitespace-nowrap">
                                    Profit/Loss
                                  </TableHead>
                                  <TableHead className="whitespace-nowrap">
                                    Status
                                  </TableHead>
                                  <TableHead className="whitespace-nowrap">
                                    Date
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {subscription.auto_trades
                                  .slice(0, 5)
                                  .map((autoTrade) => (
                                    <TableRow key={autoTrade.id}>
                                      <TableCell className="font-medium whitespace-nowrap">
                                        {autoTrade.trade.market.name}
                                      </TableCell>
                                      <TableCell className="whitespace-nowrap">
                                        <span
                                          className={`px-2 py-1 rounded text-xs font-medium ${
                                            autoTrade.trade.trade_type === "buy"
                                              ? "bg-green-100 text-green-700"
                                              : "bg-red-100 text-red-700"
                                          }`}
                                        >
                                          {autoTrade.trade.trade_type.toUpperCase()}
                                        </span>
                                      </TableCell>
                                      <TableCell className="whitespace-nowrap">
                                        {autoTrade.trade.amount}
                                      </TableCell>
                                      <TableCell className="whitespace-nowrap">
                                        {formatCurrency(autoTrade.trade.price)}
                                      </TableCell>
                                      <TableCell className="whitespace-nowrap">
                                        <span
                                          className={`text-sm font-medium ${
                                            Number(
                                              autoTrade.trade.current_profit
                                            ) >= 0
                                              ? "text-green-600"
                                              : "text-red-600"
                                          }`}
                                        >
                                          {autoTrade.trade.status === "open"
                                            ? "-"
                                            : formatCurrency(
                                                autoTrade.trade.current_profit
                                              )}
                                        </span>
                                      </TableCell>
                                      <TableCell className="whitespace-nowrap">
                                        <span
                                          className={`px-2 py-1 rounded text-xs font-medium ${
                                            autoTrade.trade.status === "open"
                                              ? "bg-blue-100 text-blue-700"
                                              : autoTrade.trade.status ===
                                                "closed"
                                              ? "bg-gray-100 text-gray-700"
                                              : "bg-yellow-100 text-yellow-700"
                                          }`}
                                        >
                                          {autoTrade.trade.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            autoTrade.trade.status.slice(1)}
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-muted-foreground whitespace-nowrap">
                                        {formatDate(autoTrade.trade.created_at)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>

                        {subscription.auto_trades.length === 0 && (
                          <p className="text-center text-gray-500 py-8">
                            No trades yet. Auto-trading will begin shortly.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
