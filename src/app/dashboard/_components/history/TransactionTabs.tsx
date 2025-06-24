// components/TransactionTabs.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionTable from "./TransactionTable";
import { Transaction } from "@/utils/types";

interface TransactionTabsProps {
  transactions: Transaction[];
  onTransactionSelect: (transaction: Transaction) => void;
}

export default function TransactionTabs({
  transactions,
  onTransactionSelect,
}: TransactionTabsProps) {
  const deposits = transactions.filter((t) => t.transaction_type === "deposit");
  const withdrawals = transactions.filter(
    (t) => t.transaction_type === "withdrawal"
  );
  const pending = transactions.filter((t) => t.status === "pending");

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full md:grid-cols-4 grid-cols-2 w-full h-fit">
        <TabsTrigger value="all">All ({transactions.length})</TabsTrigger>
        <TabsTrigger value="deposits">Deposits ({deposits.length})</TabsTrigger>
        <TabsTrigger value="withdrawals">
          Withdrawals ({withdrawals.length})
        </TabsTrigger>
        <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        <TransactionTable
          transactions={transactions}
          onTransactionSelect={onTransactionSelect}
        />
      </TabsContent>

      <TabsContent value="deposits" className="space-y-4">
        <TransactionTable
          transactions={deposits}
          onTransactionSelect={onTransactionSelect}
          showExternalAddress={false}
          showType={false}
        />
      </TabsContent>

      <TabsContent value="withdrawals" className="space-y-4">
        <TransactionTable
          transactions={withdrawals}
          onTransactionSelect={onTransactionSelect}
          showType={false}
        />
      </TabsContent>

      <TabsContent value="pending" className="space-y-4">
        <TransactionTable
          transactions={pending}
          onTransactionSelect={onTransactionSelect}
          showExternalAddress={false}
        />
      </TabsContent>
    </Tabs>
  );
}
