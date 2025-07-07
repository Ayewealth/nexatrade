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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  DollarSign,
  Target,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import TradingViewChart from "@/components/reusable/trading-view/TvChart";
import { useAppSelector } from "@/lib/redux/store";
import { PaginationControls } from "./tradingPaginationControl";
import { useCloseTrade, usePlaceTrade } from "@/hooks/auth";

const formatCurrency = (amount: string | number | undefined) => {
  if (!amount) return "$0.00";
  const numAmount =
    typeof amount === "string" ? Number.parseFloat(amount) : amount;
  if (isNaN(numAmount)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
};

const formatCrypto = (amount: string | undefined, symbol: string) => {
  if (!amount) return `0.00000000 ${symbol}`;
  const numAmount = Number.parseFloat(amount);
  if (isNaN(numAmount)) return `0.00000000 ${symbol}`;
  return `${numAmount.toFixed(8)} ${symbol}`;
};

export default function ImageFunc() {
  const [selectedMarket, setSelectedMarket] = useState<
    (typeof markets)[0] | null
  >(null);
  const [tradeDialogMarket, setTradeDialogMarket] = useState<
    (typeof markets)[0] | null
  >(null); // Separate state for dialog
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState("1");
  const [takeProfit, setTakeProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [showTradeDialog, setShowTradeDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { theme } = useTheme();
  const { usdWallet } = useAppSelector((state) => state.wallet);
  const { userInfo } = useAppSelector((state) => state.auth);
  const { markets, trades } = useAppSelector((state) => state.trading);

  const primaryUSDWallet = usdWallet[0] || null;

  const activeMarkets = markets.filter((market) => market.is_active);
  const totalPages = Math.ceil(activeMarkets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMarkets = activeMarkets.slice(startIndex, endIndex);

  const { mutateAsync: placeTrade, isPending } = usePlaceTrade();
  const { mutateAsync: closeTrade, isPending: isLoading } = useCloseTrade();

  const calculateRequiredMargin = () => {
    if (!tradeDialogMarket || !amount) return 0;
    const tradeAmount = Number.parseFloat(amount);
    const price = Number.parseFloat(tradeDialogMarket.current_price);
    const leverageNum = Number.parseInt(leverage);
    return (tradeAmount * price) / leverageNum;
  };

  const calculatePotentialProfit = () => {
    if (!tradeDialogMarket || !amount) return 0;
    const tradeAmount = Number.parseFloat(amount);
    const price = Number.parseFloat(tradeDialogMarket.current_price);
    const leverageNum = Number.parseInt(leverage);
    // Assume 1% price movement for example
    const priceMovement = 0.01;
    return tradeAmount * price * priceMovement * leverageNum;
  };

  const handleTrade = async () => {
    if (!tradeDialogMarket) {
      toast.error("Please select a market to trade");
      return;
    }

    if (
      !amount ||
      Number.parseFloat(amount) <
        Number.parseFloat(tradeDialogMarket.min_trade_amount)
    ) {
      toast.error(
        `Minimum trade amount is ${tradeDialogMarket.min_trade_amount} ${tradeDialogMarket.base_currency.symbol}`
      );
      return;
    }

    const requiredMargin = calculateRequiredMargin();
    if (requiredMargin > Number.parseFloat(primaryUSDWallet?.balance)) {
      toast.error("You don't have enough USD balance for this trade");
      return;
    }

    if (userInfo.userData.kyc_status !== "approved") {
      toast.error("Please complete your KYC before trading");

      return;
    }

    try {
      await placeTrade({
        market: tradeDialogMarket.id,
        trade_type: tradeType,
        amount: amount,
        leverage: Number.parseInt(leverage),
        take_profit: takeProfit ? Number.parseFloat(takeProfit) : 0,
        stop_loss: stopLoss ? Number.parseFloat(stopLoss) : 0,
      });

      toast.success(
        `${tradeType.toUpperCase()} order for ${amount} ${
          tradeDialogMarket.base_currency.symbol
        } has been placed.`
      );

      // Reset form
      setAmount("");
      setTakeProfit("");
      setStopLoss("");
      setShowTradeDialog(false);
      setTradeDialogMarket(null);
    } catch (error) {
      toast.error("Failed to connect to server. Please try again.");
      console.error("Trade placement error:", error);
    }
  };

  const handleCloseTrade = async (tradeId: number) => {
    if (userInfo.userData.kyc_status !== "approved") {
      toast.error("Please complete your KYC before trading");

      return;
    }

    try {
      closeTrade(tradeId);

      toast.success(`Trade #${tradeId} has been closed successfully.`);
    } catch (error) {
      toast.error("Failed to connect to server");
      console.error("Trade closure error:", error);
    }
  };

  const handleRowClick = (market: any) => {
    setSelectedMarket(market);
  };

  const handleTradeButtonClick = (e: React.MouseEvent, market: any) => {
    e.stopPropagation(); // Prevent row click
    setTradeDialogMarket(market);
    setShowTradeDialog(true);
  };

  const handleDialogClose = (open: boolean) => {
    setShowTradeDialog(open);
    if (!open) {
      // Reset trade dialog state when closing
      setTradeDialogMarket(null);
      setAmount("");
      setTakeProfit("");
      setStopLoss("");
      setTradeType("buy");
      setLeverage("1");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trade Center</h1>
          <p className="text-muted-foreground">
            Trade cryptocurrencies with leverage and advanced features
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-lg font-bold">
              {formatCurrency(primaryUSDWallet?.balance)}
            </p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Live Trading
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Trading Chart - Takes up 3 columns */}
        <div className="xl:col-span-3">
          <Card className="p-4">
            <CardContent className="p-0">
              <TradingViewChart
                theme={theme === "dark" ? "dark" : "light"}
                height={500}
                className="h-full w-full"
              />
            </CardContent>
          </Card>

          {/* Markets List Below Chart */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Available Markets
              </CardTitle>
              <CardDescription>
                Select a cryptocurrency market to start trading
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Market</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Info</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentMarkets.map((market) => (
                      <TableRow
                        key={market.id}
                        className={`cursor-pointer hover:bg-muted/50 ${
                          selectedMarket?.id === market.id ? "bg-muted" : ""
                        }`}
                        onClick={() => handleRowClick(market)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Image
                              src={
                                market.base_currency.logo_url ||
                                "/placeholder.svg"
                              }
                              alt={market.base_currency.name}
                              width={32}
                              height={32}
                              className="w-8 h-8"
                            />
                            <div>
                              <p className="font-medium">{market.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {market.base_currency.name}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">
                          {formatCurrency(market.current_price)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Active</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          <span className="text-muted-foreground">
                            Live Market
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={(e) => handleTradeButtonClick(e, market)}
                            className="cursor-pointer"
                          >
                            Trade
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  activeMarkets={activeMarkets}
                  totalPages={totalPages}
                  startIndex={startIndex}
                  endIndex={endIndex}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Trading Panel & Open Trades - Takes up 1 column */}
        <div className="xl:col-span-1 space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Trading Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Available Balance</p>
                  <p className="font-bold text-lg">
                    {formatCurrency(primaryUSDWallet?.balance)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Open Trades</p>
                  <p className="font-bold text-lg">
                    {trades?.filter((t) => t.status === "open").length}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total P&L</p>
                  {(() => {
                    const totalProfit = trades
                      ?.filter((t) => t.status === "open")
                      .reduce(
                        (sum, trade) =>
                          sum + Number.parseFloat(trade.current_profit),
                        0
                      );

                    const profitColor =
                      totalProfit < 0 ? "text-red-600" : "text-green-600";

                    return (
                      <p className={`font-bold text-lg ${profitColor}`}>
                        {formatCurrency(totalProfit)}
                      </p>
                    );
                  })()}
                </div>
                <div>
                  <p className="text-muted-foreground">Win Rate</p>
                  <p className="font-bold text-lg">68%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Info for Selected Pair */}
          {selectedMarket && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image
                    src={
                      selectedMarket.base_currency.logo_url ||
                      "/placeholder.svg"
                    }
                    alt={selectedMarket.base_currency.name}
                    width={32}
                    height={32}
                    className="w-5 h-5"
                  />
                  {selectedMarket.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Price</p>
                    <p className="font-bold">
                      {formatCurrency(selectedMarket.current_price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">24h Change</p>
                    <p
                      className={`font-bold ${
                        (selectedMarket?.price_change_24h || 0) >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {(selectedMarket?.price_change_24h || 0) >= 0 ? "+" : ""}
                      {(selectedMarket?.price_change_24h || 0).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">24h High</p>
                    <p className="font-bold text-green-600">
                      {formatCurrency(selectedMarket.high_24h)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">24h Low</p>
                    <p className="font-bold text-red-600">
                      {formatCurrency(selectedMarket.low_24h)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">24h Volume</p>
                    <p className="font-bold">
                      {formatCurrency(selectedMarket.volume_24h)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Open Trades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Open Trades
              </CardTitle>
              <CardDescription>Your active trading positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trades
                  ?.filter((trade) => trade.status === "open")
                  .map((trade) => (
                    <div
                      key={trade.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{trade.market.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {trade.trade_type.toUpperCase()} • {trade.leverage}x
                            Leverage
                          </p>
                        </div>
                        <Badge
                          variant={
                            trade.trade_type === "buy"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {trade.trade_type.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Amount</p>
                          <p className="font-mono">
                            {formatCrypto(
                              trade.amount,
                              trade.market.base_currency.symbol
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Entry Price</p>
                          <p className="font-mono">
                            {formatCurrency(trade.price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current P&L</p>
                          <p
                            className={`font-mono ${
                              Number.parseFloat(trade.current_profit) >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {Number.parseFloat(trade.current_profit) >= 0
                              ? "+"
                              : ""}
                            {formatCurrency(trade.current_profit)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Duration</p>
                          <p className="text-sm">
                            {Math.floor(
                              (Date.now() -
                                new Date(trade.created_at).getTime()) /
                                (1000 * 60 * 60)
                            )}
                            h
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCloseTrade(trade.id)}
                        disabled={isLoading}
                        className="w-full cursor-pointer"
                      >
                        Close Trade
                      </Button>
                    </div>
                  ))}

                {trades?.filter((trade) => trade.status === "open").length ===
                  0 && (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No open trades</p>
                    <p className="text-sm text-muted-foreground">
                      Select a market above to start trading
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trade Dialog - Moved outside the table */}
      <Dialog open={showTradeDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Place Trade</DialogTitle>
            <DialogDescription>
              {tradeDialogMarket?.name} •{" "}
              {formatCurrency(tradeDialogMarket?.current_price || "0")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={tradeType === "buy" ? "default" : "outline"}
                onClick={() => setTradeType("buy")}
                className="w-full cursor-pointer"
              >
                Buy
              </Button>
              <Button
                variant={tradeType === "sell" ? "destructive" : "outline"}
                onClick={() => setTradeType("sell")}
                className="w-full cursor-pointer"
              >
                Sell
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">
                Amount ({tradeDialogMarket?.base_currency.symbol})
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00000000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={tradeDialogMarket?.min_trade_amount}
                step="0.00000001"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Min: {tradeDialogMarket?.min_trade_amount}{" "}
                {tradeDialogMarket?.base_currency.symbol}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leverage">Leverage</Label>
              <Select value={leverage} onValueChange={setLeverage}>
                <SelectTrigger className="w-full">
                  <SelectValue className="w-full" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                  <SelectItem value="5">5x</SelectItem>
                  <SelectItem value="10">10x</SelectItem>
                  <SelectItem value="20">20x</SelectItem>
                  <SelectItem value="50">50x</SelectItem>
                  <SelectItem value="100">100x</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="take-profit">Take Profit (Optional)</Label>
                <Input
                  id="take-profit"
                  type="number"
                  placeholder="0.00"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stop-loss">Stop Loss (Optional)</Label>
                <Input
                  id="stop-loss"
                  type="number"
                  placeholder="0.00"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  step="0.01"
                />
              </div>
            </div>

            {amount && tradeDialogMarket && (
              <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Required Margin:</span>
                  <span className="font-mono">
                    {formatCurrency(calculateRequiredMargin())}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Potential Profit (1%):</span>
                  <span className="font-mono text-green-600">
                    +{formatCurrency(calculatePotentialProfit())}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Available Balance:</span>
                  <span className="font-mono">
                    {formatCurrency(primaryUSDWallet?.balance)}
                  </span>
                </div>
              </div>
            )}

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Trading with leverage involves significant risk. You may lose
                more than your initial investment.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleTrade}
              disabled={isPending || !amount || !tradeDialogMarket}
              className="w-full"
              variant={tradeType === "buy" ? "default" : "destructive"}
            >
              {isPending
                ? "Placing Trade..."
                : `${tradeType.toUpperCase()} ${
                    tradeDialogMarket?.base_currency.symbol
                  }`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
