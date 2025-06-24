"use client";

import { useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Copy,
  Wallet,
  Bitcoin,
  AlertCircle,
  QrCode,
  Send,
  Info,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/redux/store";
import { useCreateDepositTransaction } from "@/hooks/auth";

const formatBalance = (balance: string, symbol?: string) => {
  const numBalance = Number.parseFloat(balance);
  return `${numBalance.toFixed(8)} ${symbol || ""}`;
};

export default function DepositPage() {
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState("");

  const { walletInfo, usdWallet } = useAppSelector((state) => state.wallet);
  const { mutateAsync, isPending } = useCreateDepositTransaction();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Address copied to clipboard");
  };

  const selectedCryptoWallet = walletInfo.find(
    (w) => w.id.toString() === selectedWallet
  );

  const handleDepositTransaction = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!selectedCryptoWallet) {
      toast.error("Please select a wallet");
      return;
    }

    const amount = Number.parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid deposit amount");
      return;
    }

    try {
      await mutateAsync({
        crypto_wallet: selectedCryptoWallet.id,
        amount: amount.toString(),
      });
      toast.success("Deposit successful");
      setDepositAmount("");
    } catch (error) {
      toast.error("Failed to connect to server. Please try again.");
      console.error("Deposit transaction error:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Deposit Cryptocurrency
          </h1>
          <p className="text-muted-foreground">
            Add cryptocurrency to your trading account
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Wallet Selection - Horizontal Layout */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Your Crypto Wallets
            </CardTitle>
            <CardDescription>
              Select a cryptocurrency to deposit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* USD Wallet */}
              <div
                className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-200 bg-gradient-to-br from-green-500 to-green-600 text-white ${
                  selectedWallet === `usd-${usdWallet && usdWallet[0]?.id}`
                    ? "ring-2 ring-green-400 ring-offset-2 scale-105"
                    : "hover:scale-102"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">$</span>
                  </div>
                  <div className="flex-1 flex justify-end">
                    <svg
                      width="60"
                      height="30"
                      viewBox="0 0 60 30"
                      className="text-white/60"
                    >
                      <path
                        d="M5 15 Q15 10 25 15 T45 20 T55 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">
                    $
                    {formatBalance((usdWallet && usdWallet[0]?.balance) ?? "0")}{" "}
                    USD
                  </div>
                  <div className="text-white/80 text-xs">US Dollar</div>
                </div>
              </div>

              {/* Crypto Wallets */}
              <div className="overflow-x-auto">
                <div className="flex gap-4 min-w-max">
                  {walletInfo.map((wallet, index) => {
                    const colors = [
                      "from-orange-500 to-orange-600", // Bitcoin - Orange
                      "from-blue-500 to-blue-600", // Ethereum - Blue
                      "from-gray-500 to-gray-600", // Litecoin - Gray
                      "from-purple-500 to-purple-600", // Cardano - Purple
                    ];
                    const ringColors = [
                      "ring-orange-400",
                      "ring-blue-400",
                      "ring-gray-400",
                      "ring-purple-400",
                    ];
                    return (
                      <div
                        key={wallet.id}
                        className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-200 bg-gradient-to-br ${
                          colors[index % colors.length]
                        } text-white flex-shrink-0 w-64 ${
                          selectedWallet === wallet.id.toString()
                            ? `ring-2 ${
                                ringColors[index % ringColors.length]
                              } ring-offset-2 scale-105`
                            : "hover:scale-102"
                        }`}
                        onClick={() => setSelectedWallet(wallet.id.toString())}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Image
                              src={
                                wallet.crypto_type.logo_url ||
                                "/placeholder.svg"
                              }
                              alt={wallet.crypto_type.name}
                              width={24}
                              height={24}
                              className="w-6 h-6"
                            />
                          </div>
                          <div className="flex-1 flex justify-end">
                            <svg
                              width="60"
                              height="30"
                              viewBox="0 0 60 30"
                              className="text-white/60"
                            >
                              <path
                                d={
                                  index === 2
                                    ? "M5 10 Q15 20 25 15 T45 25 T55 20"
                                    : "M5 25 Q15 15 25 20 T45 10 T55 15"
                                }
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-2xl font-bold">
                            {formatBalance(
                              wallet.balance,
                              wallet.crypto_type.symbol
                            )}
                          </div>
                          <div className="text-white/80 text-xs">
                            {wallet.crypto_type.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deposit Instructions */}
        <div className="w-full">
          {!selectedWallet ? (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a cryptocurrency to view deposit instructions
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            selectedCryptoWallet && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bitcoin className="h-5 w-5" />
                      {selectedCryptoWallet.crypto_type.name} Deposit
                    </CardTitle>
                    <CardDescription>
                      Send {selectedCryptoWallet.crypto_type.symbol} to your
                      wallet address below
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Important:</strong> Only send{" "}
                        {selectedCryptoWallet.crypto_type.symbol} to this
                        address. Sending other cryptocurrencies may result in
                        permanent loss of funds.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <Label
                            htmlFor="wallet-address"
                            className="text-base font-medium"
                          >
                            Your {selectedCryptoWallet.crypto_type.symbol}{" "}
                            Deposit Address
                          </Label>
                          <div className="flex gap-2 mt-3">
                            <Input
                              id="wallet-address"
                              value={selectedCryptoWallet.wallet_address}
                              readOnly
                              className="font-mono text-sm bg-muted"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                copyToClipboard(
                                  selectedCryptoWallet.wallet_address
                                )
                              }
                              className="cursor-pointer"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Click the copy button to copy the address to your
                            clipboard
                          </p>
                        </div>

                        <div className="bg-muted p-6 rounded-lg space-y-4">
                          <h4 className="font-medium text-base">
                            Deposit Information
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-foreground">
                                Network:
                              </p>
                              <p className="text-muted-foreground">
                                {selectedCryptoWallet.crypto_type.name}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                Minimum Deposit:
                              </p>
                              <p className="text-muted-foreground">
                                0.001 {selectedCryptoWallet.crypto_type.symbol}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                Confirmations:
                              </p>
                              <p className="text-muted-foreground">
                                {selectedCryptoWallet.crypto_type.symbol ===
                                "BTC"
                                  ? "3"
                                  : "12"}{" "}
                                blocks
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                Processing Time:
                              </p>
                              <p className="text-muted-foreground">
                                15-60 minutes
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                          <h4 className="font-medium mb-2 text-yellow-800">
                            Important Notes:
                          </h4>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            <li>
                              • Deposits below the minimum amount will not be
                              credited
                            </li>
                            <li>
                              • Your deposit will be credited after network
                              confirmations
                            </li>
                            <li>• Save this address for future deposits</li>
                            <li>
                              • Contact support if your deposit doesn&apos;t
                              appear after 2 hours
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-64 h-64 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <QrCode className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                            <p className="text-sm text-gray-500">QR Code</p>
                            <p className="text-xs text-gray-400">
                              Scan to get address
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                          Scan this QR code with your wallet app to get the
                          deposit address
                        </p>
                      </div>
                    </div>

                    <Alert className="border-blue-200 bg-blue-50">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>First time depositing?</strong> Start with a
                        small test amount to ensure everything works correctly
                        before sending larger amounts.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Create Deposit Transaction Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      Create Deposit Transaction
                    </CardTitle>
                    <CardDescription>
                      After sending {selectedCryptoWallet.crypto_type.symbol} to
                      the address above, create a transaction record
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={handleDepositTransaction}
                      className="space-y-6 max-w-md"
                    >
                      <div>
                        <Label
                          htmlFor="deposit-amount"
                          className="text-base font-medium"
                        >
                          Deposit Amount (
                          {selectedCryptoWallet.crypto_type.symbol})
                        </Label>
                        <Input
                          id="deposit-amount"
                          type="number"
                          placeholder="0.00000000"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          min="0.00000001"
                          step="0.00000001"
                          required
                          className="mt-3 font-mono"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          Enter the exact amount you sent to the deposit address
                        </p>
                      </div>

                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Creating a transaction record helps us track your
                          deposit and credit your account faster once the
                          blockchain transaction is confirmed.
                        </AlertDescription>
                      </Alert>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                      >
                        {isPending
                          ? "Creating Transaction..."
                          : "Create Deposit Transaction"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
