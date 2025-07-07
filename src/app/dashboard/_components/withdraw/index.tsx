"use client";

import type React from "react";

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, ArrowUpRight, AlertTriangle, Info, Send } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/redux/store";
import { useCreateWithdrawalTransaction } from "@/hooks/auth";

const formatBalance = (balance: string, symbol?: string) => {
  const numBalance = Number.parseFloat(balance);
  return `${numBalance.toFixed(8)} ${symbol || ""}`;
};

export default function WithdrawalPage() {
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [externalAddress, setExternalAddress] = useState("");

  const { walletInfo, usdWallet } = useAppSelector((state) => state.wallet);
  const { userInfo } = useAppSelector((state) => state.auth);
  const { mutateAsync, isPending } = useCreateWithdrawalTransaction();

  const selectedCryptoWallet = walletInfo.find(
    (w) => w.id.toString() === selectedWallet
  );

  const getAvailableBalance = () => {
    if (selectedCryptoWallet)
      return Number.parseFloat(selectedCryptoWallet.balance);
    return 0;
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number.parseFloat(withdrawalAmount);
    const availableBalance = getAvailableBalance();

    if (!selectedCryptoWallet) {
      toast.error("Please select a wallet");
      return;
    }

    if (amount > availableBalance) {
      toast.error(
        `Insufficient balance. Available: ${formatBalance(
          availableBalance.toString(),
          selectedCryptoWallet.crypto_type.symbol
        )}`
      );
      return;
    }

    if (!externalAddress) {
      toast.error("Please enter a valid destination address");
      return;
    }

    if (userInfo.userData.kyc_status !== "approved") {
      toast.error("Please complete your KYC before withdrawing funds");

      return;
    }

    try {
      await mutateAsync({
        crypto_wallet: selectedCryptoWallet.id,
        amount: amount.toString(),
        external_address: externalAddress,
      });
      toast.success(
        "Your withdrawal request has been submitted for processing."
      );
      setWithdrawalAmount("");
      setExternalAddress("");
    } catch (error) {
      toast.error("Failed to connect to server. Please try again.");
      console.error("Withdrawal transaction error:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Withdraw Cryptocurrency
          </h1>
          <p className="text-muted-foreground">
            Send cryptocurrency to external wallets
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
              Select a cryptocurrency to withdraw
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
                          colors[index]
                        } text-white ${
                          selectedWallet === wallet.id.toString()
                            ? `ring-2 ${ringColors[index]} ring-offset-2 scale-105`
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
                              width={24}
                              height={24}
                              alt={wallet.crypto_type.name}
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
                          <Badge
                            variant="secondary"
                            className="text-xs mt-2 bg-white/20 text-white border-0"
                          >
                            Available
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Form */}
        <div className="w-full">
          {!selectedWallet ? (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <ArrowUpRight className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a cryptocurrency to start withdrawing
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            selectedCryptoWallet && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    {selectedCryptoWallet.crypto_type.name} Withdrawal
                  </CardTitle>
                  <CardDescription>
                    Send {selectedCryptoWallet.crypto_type.symbol} to an
                    external wallet address
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="">
                    <form onSubmit={handleWithdrawal} className="space-y-6">
                      {/* External Address */}
                      <div>
                        <Label
                          htmlFor="external-address"
                          className="text-base font-medium"
                        >
                          Destination {selectedCryptoWallet.crypto_type.symbol}{" "}
                          Address
                        </Label>
                        <Input
                          id="external-address"
                          placeholder={`Enter ${selectedCryptoWallet.crypto_type.symbol} address`}
                          value={externalAddress}
                          onChange={(e) => setExternalAddress(e.target.value)}
                          required
                          className="mt-3 font-mono text-sm"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          Double-check the address. Cryptocurrency transactions
                          cannot be reversed.
                        </p>
                      </div>

                      {/* Amount */}
                      <div>
                        <Label
                          htmlFor="amount"
                          className="text-base font-medium"
                        >
                          Withdrawal Amount (
                          {selectedCryptoWallet.crypto_type.symbol})
                        </Label>
                        <div className="relative mt-3">
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.00000000"
                            value={withdrawalAmount}
                            onChange={(e) =>
                              setWithdrawalAmount(e.target.value)
                            }
                            required
                            className="font-mono"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
                            onClick={() =>
                              setWithdrawalAmount(
                                getAvailableBalance().toString()
                              )
                            }
                          >
                            Max
                          </Button>
                        </div>
                        {selectedCryptoWallet.balance && (
                          <div className="text-sm text-muted-foreground mt-2 space-y-1">
                            <p>
                              Available:{" "}
                              {formatBalance(
                                getAvailableBalance().toString(),
                                selectedCryptoWallet.crypto_type.symbol
                              )}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Fee Information */}
                      {withdrawalAmount && (
                        <div className="bg-muted p-4 rounded-lg space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Withdrawal Amount:</span>
                            <span className="font-mono">
                              {withdrawalAmount}{" "}
                              {selectedCryptoWallet.crypto_type.symbol}
                            </span>
                          </div>
                          <hr />
                          <div className="flex justify-between text-sm font-medium">
                            <span>You will send:</span>
                            <span className="font-mono">
                              {withdrawalAmount}{" "}
                              {selectedCryptoWallet.crypto_type.symbol}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Network Information */}
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2 text-blue-800">
                          Network Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-blue-800">
                              Network:
                            </p>
                            <p className="text-blue-700">
                              {selectedCryptoWallet.crypto_type.name}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-blue-800">
                              Confirmations:
                            </p>
                            <p className="text-blue-700">
                              {selectedCryptoWallet.crypto_type.symbol === "BTC"
                                ? "3"
                                : "12"}{" "}
                              blocks
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-blue-800">
                              Processing Time:
                            </p>
                            <p className="text-blue-700">15-60 minutes</p>
                          </div>
                          <div>
                            <p className="font-medium text-blue-800">Status:</p>
                            <p className="text-blue-700">Automated</p>
                          </div>
                        </div>
                      </div>

                      {/* Warnings */}
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Warning:</strong> Cryptocurrency transactions
                          are irreversible. Please verify the destination
                          address carefully before confirming. Sending to an
                          incorrect address will result in permanent loss of
                          funds.
                        </AlertDescription>
                      </Alert>

                      {/* Processing Info */}
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Withdrawals are processed automatically but may be
                          delayed during high network congestion. Large
                          withdrawals may require additional security
                          verification.
                        </AlertDescription>
                      </Alert>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending || !withdrawalAmount}
                      >
                        {isPending ? "Processing..." : "Submit Withdrawal"}
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
