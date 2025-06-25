// components/TransactionTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  getStatusBadge,
  getTransactionIcon,
  formatDate,
  formatAmount,
} from "@/utils/transactionUtils";
import TransactionDetailsModal from "./TransactionModal";
import { Transaction } from "@/utils/types";

interface TransactionTableProps {
  transactions: Transaction[];
  onTransactionSelect: (transaction: Transaction) => void;
  showExternalAddress?: boolean;
  showType?: boolean;
}

export default function TransactionTable({
  transactions,
  onTransactionSelect,
  showExternalAddress = true,
  showType = true,
}: TransactionTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                {showType && <TableHead>Type</TableHead>}
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Wallet</TableHead>
                {showExternalAddress && <TableHead>External Address</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    #{transaction.id}
                  </TableCell>
                  {showType && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(transaction.transaction_type ?? "")}
                        <span className="capitalize">
                          {transaction.transaction_type}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="font-mono">
                    {formatAmount(
                      transaction.amount,
                      transaction.crypto_wallet || transaction.usd_wallet
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(transaction.status ?? "")}</TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {transaction.crypto_wallet ||
                        transaction.usd_wallet ||
                        "N/A"}
                    </span>
                  </TableCell>
                  {showExternalAddress && (
                    <TableCell>
                      {transaction.external_address ? (
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {transaction.external_address.slice(0, 10)}...
                          {transaction.external_address.slice(-6)}
                        </code>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="text-sm">
                    {formatDate(transaction.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <TransactionDetailsModal
                      transaction={transaction}
                      onTransactionSelect={onTransactionSelect}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
