"use client";

import React, { useEffect } from "react";
import { getTransactionHistory } from "@/actions/auth";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { Transaction } from "@/utils/types";
import TransactionFilters from "../_components/history/TransactionFilter";
import TransactionTabs from "../_components/history/TransactionTabs";
import { useDispatch } from "react-redux";
import { setTransactionHistoryInfo } from "@/lib/redux/slice/transactionSlice";
import { useAppSelector } from "@/lib/redux/store";
import { toast } from "sonner";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const { transactionHistoryInfo } = useAppSelector(
    (state) => state.transactionHistory
  );
  const dispatch = useDispatch();

  const { data, isLoading } = useQuery({
    queryKey: ["transactionHistory"],
    queryFn: getTransactionHistory,
  });

  const filteredTransactions = transactionHistoryInfo.transactionHistoryData
    .filter((transaction) => {
      const matchesSearch =
        transaction.external_address
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.amount.includes(searchTerm) ||
        transaction.id.toString().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;
      const matchesType =
        typeFilter === "all" || transaction.transaction_type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];

      if (sortOrder === "asc") {
        return aValue == null || bValue == null ? 0 : aValue > bValue ? 1 : -1;
      }
      return aValue == null || bValue == null ? 0 : aValue < bValue ? 1 : -1;
    });

  useEffect(() => {
    if (data) {
      dispatch(
        setTransactionHistoryInfo({
          transactionHistoryData: data,
        })
      );
    }
  }, [data, dispatch]);

  // Client-side CSV export functionality
  const handleExport = () => {
    try {
      // Prepare CSV headers
      const headers = [
        "ID",
        "Type",
        "Amount",
        "Status",
        "Crypto Wallet",
        "USD Wallet",
        "External Address",
        "Created At",
        "Updated At",
        "Notes",
      ];

      // Convert transactions to CSV rows
      const csvRows = [
        headers.join(","), // Header row
        ...filteredTransactions.map((transaction) =>
          [
            transaction.id,
            transaction.transaction_type,
            transaction.amount,
            transaction.status,
            transaction.crypto_wallet || "",
            transaction.usd_wallet || "",
            transaction.external_address || "",
            new Date(transaction.created_at).toLocaleDateString(),
            new Date(transaction.updated_at).toLocaleDateString(),
            transaction.notes || "",
          ]
            .map((field) => `"${String(field).replace(/"/g, '""')}"`) // Escape quotes
            .join(",")
        ),
      ];

      // Create CSV content
      const csvContent = csvRows.join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export error:", err);
      // You might want to show a toast notification here
      toast.error("Failed to export transactions. Please try again.");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading transactions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Transaction History
          </h1>
          <p className="text-muted-foreground">
            View and manage your deposit and withdrawal transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <TransactionFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <TransactionTabs
        transactions={filteredTransactions}
        onTransactionSelect={setSelectedTransaction}
      />

      {/* Show message when no transactions found */}
      {!isLoading && filteredTransactions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {transactionHistoryInfo.transactionHistoryData.length === 0
              ? "No transactions found."
              : "No transactions match your current filters."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Page;
