// components/TransactionDetailsModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";
import { Transaction } from "@/utils/types";
import {
  formatAmount,
  formatDate,
  getStatusBadge,
  getTransactionIcon,
} from "@/utils/transactionUtils";

interface TransactionDetailsModalProps {
  transaction: Transaction;
  onTransactionSelect: (transaction: Transaction) => void;
}

export default function TransactionDetailsModal({
  transaction,
  onTransactionSelect,
}: TransactionDetailsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTransactionSelect(transaction)}
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">View details</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Complete information for transaction #{transaction.id}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Transaction ID</Label>
            <p className="text-sm">#{transaction.id}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Type</Label>
            <div className="flex items-center gap-2">
              {getTransactionIcon(transaction.transaction_type)}
              <span className="capitalize text-sm">
                {transaction.transaction_type}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Amount</Label>
            <p className="text-sm font-mono">
              {formatAmount(
                transaction.amount,
                transaction.crypto_wallet || transaction.usd_wallet
              )}
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            {getStatusBadge(transaction.status)}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Wallet</Label>
            <p className="text-sm">
              {transaction.crypto_wallet || transaction.usd_wallet || "N/A"}
            </p>
          </div>
          {transaction.external_address && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">External Address</Label>
              <code className="text-xs bg-muted px-2 py-1 rounded block break-all">
                {transaction.external_address}
              </code>
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Created</Label>
            <p className="text-sm">{formatDate(transaction.created_at)}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Last Updated</Label>
            <p className="text-sm">{formatDate(transaction.updated_at)}</p>
          </div>
          {transaction.notes && (
            <div className="space-y-2 col-span-2">
              <Label className="text-sm font-medium">Notes</Label>
              <p className="text-sm bg-muted p-2 rounded">
                {transaction.notes}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
