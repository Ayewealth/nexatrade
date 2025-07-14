import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConvertCryptoToUSD, useConvertUSDToCrypto } from "@/hooks/auth";
import { USDWallet, WalletInterface, WalletUSDValue } from "@/utils/types";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  wallets: WalletInterface[];
  walletUSDValues: WalletUSDValue[];
  usdWallet?: USDWallet;
};

const Convert = ({ wallets, walletUSDValues, usdWallet }: Props) => {
  const [showConversionDialog, setShowConversionDialog] = useState(false);
  const [conversionType, setConversionType] = useState<
    "crypto-to-usd" | "usd-to-crypto"
  >("crypto-to-usd");
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [conversionAmount, setConversionAmount] = useState("");

  const { mutateAsync, isPending } = useConvertUSDToCrypto();
  const { mutateAsync: convertCrypto, isPending: isLoading } =
    useConvertCryptoToUSD();

  const getCryptoWalletWithPrice = (walletId: number) => {
    return walletUSDValues.find((wv) => wv.wallet_id === walletId);
  };

  const getAvailableBalance = () => {
    if (selectedWallet) return Number.parseFloat(selectedWallet.balance);
    return 0;
  };

  const calculateConversionRate = (wallet: any) => {
    if (!wallet) return 0;

    const walletWithPrice = getCryptoWalletWithPrice(wallet.id);
    const currentPrice = walletWithPrice?.current_price_usd;

    return currentPrice;
  };

  const calculateConversionResult = () => {
    if (!selectedWallet || !conversionAmount) return 0;
    const amount = Number.parseFloat(conversionAmount);
    const rate = calculateConversionRate(selectedWallet);

    if (conversionType === "crypto-to-usd") {
      return amount * rate!;
    } else {
      return amount / rate!;
    }
  };

  const handleConversion = async () => {
    if (!selectedWallet || !conversionAmount) {
      toast.error("Please select a wallet and enter an amount");
      return;
    }

    if (selectedWallet.balance < conversionAmount) {
      toast.error(`Insufficient ${selectedWallet.crypto_type.name} Balance`);
    }

    try {
      if (conversionType === "crypto-to-usd") {
        const cryptoToUsd = await convertCrypto({
          crypto_wallet: selectedWallet.id,
          amount: conversionAmount,
        });
        console.log(cryptoToUsd);
      } else {
        const usdToCrypto = await mutateAsync({
          crypto_wallet: selectedWallet.id,
          amount: conversionAmount,
        });

        console.log(usdToCrypto);
      }
      toast.success(
        `Successfully converted ${
          conversionType === "crypto-to-usd"
            ? `${conversionAmount} ${selectedWallet.crypto_type.symbol} to USD`
            : `$${conversionAmount} USD to ${selectedWallet.crypto_type.symbol}`
        }`
      );
      setConversionAmount("");
    } catch (error) {
      toast.error("An Error Occured During Conversion. Please Try Again!");
      console.error("Error During Conversion:", error);
    }
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

  return (
    <Dialog open={showConversionDialog} onOpenChange={setShowConversionDialog}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full cursor-pointer">
          <RefreshCw className="h-4 w-4 mr-2" />
          Convert Now
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Currency Conversion</DialogTitle>
          <DialogDescription>
            Convert between your crypto wallets and USD wallet
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Conversion Type</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                variant={
                  conversionType === "crypto-to-usd" ? "default" : "outline"
                }
                onClick={() => setConversionType("crypto-to-usd")}
                className="w-full cursor-pointer"
              >
                Crypto → USD
              </Button>
              <Button
                variant={
                  conversionType === "usd-to-crypto" ? "default" : "outline"
                }
                onClick={() => setConversionType("usd-to-crypto")}
                className="w-full cursor-pointer"
              >
                USD → Crypto
              </Button>
            </div>
          </div>

          <div>
            <Label>Select Wallet</Label>
            <Select
              value={selectedWallet?.id?.toString() || ""}
              onValueChange={(value) => {
                const wallet = wallets.find((w) => w.id.toString() === value);
                setSelectedWallet(wallet);
              }}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Choose a crypto wallet" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id.toString()}>
                    <div className="flex items-center gap-2">
                      <Image
                        src={wallet.crypto_type.logo_url || "/placeholder.svg"}
                        alt={wallet.crypto_type.name}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      {wallet.crypto_type.name} ({wallet.crypto_type.symbol})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>
              Amount{" "}
              {conversionType === "crypto-to-usd"
                ? `(${selectedWallet?.crypto_type.symbol || "Crypto"})`
                : "(USD)"}
            </Label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00000000"
                value={conversionAmount}
                onChange={(e) => setConversionAmount(e.target.value)}
                step="0.00000001"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
                onClick={() =>
                  setConversionAmount(getAvailableBalance().toString())
                }
              >
                Max
              </Button>
            </div>
            {selectedWallet && (
              <p className="text-xs text-muted-foreground mt-1">
                Available:{" "}
                {conversionType === "crypto-to-usd"
                  ? `${selectedWallet.balance} ${selectedWallet.crypto_type.symbol}`
                  : formatCurrency(usdWallet?.balance ?? "0")}
              </p>
            )}
          </div>

          {conversionAmount && selectedWallet && (
            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Exchange Rate:</span>
                <span className="font-mono">
                  1 {selectedWallet.crypto_type.symbol} ={" "}
                  {formatCurrency(calculateConversionRate(selectedWallet) ?? 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>You will receive:</span>
                <span className="font-mono font-bold">
                  {conversionType === "crypto-to-usd"
                    ? formatCurrency(calculateConversionResult())
                    : `${calculateConversionResult().toFixed(8)} ${
                        selectedWallet.crypto_type.symbol
                      }`}
                </span>
              </div>
            </div>
          )}

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Conversion rates are based on current market prices and may
              fluctuate.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleConversion}
            disabled={
              isPending || isLoading || !conversionAmount || !selectedWallet
            }
            className="w-full"
          >
            {isPending || isLoading
              ? "Processing Conversion..."
              : `Convert ${
                  conversionType === "crypto-to-usd"
                    ? `${selectedWallet?.crypto_type.symbol || "Crypto"} to USD`
                    : `USD to ${selectedWallet?.crypto_type.symbol || "Crypto"}`
                }`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Convert;
