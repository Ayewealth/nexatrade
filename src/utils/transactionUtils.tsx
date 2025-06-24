import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

export const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: {
      variant: "secondary" as const,
      color: "bg-yellow-100 text-yellow-800",
    },
    approved: {
      variant: "default" as const,
      color: "bg-blue-100 text-blue-800",
    },
    rejected: {
      variant: "destructive" as const,
      color: "bg-red-100 text-red-800",
    },
    completed: {
      variant: "default" as const,
      color: "bg-green-100 text-green-800",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <Badge variant={config.variant} className={config.color}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </Badge>
  );
};

export const getTransactionIcon = (type: string) => {
  return type === "deposit" ? (
    <ArrowDownIcon className="h-4 w-4 text-green-600" />
  ) : (
    <ArrowUpIcon className="h-4 w-4 text-red-600" />
  );
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatAmount = (amount: string, wallet: string | null) => {
  const numAmount = Number.parseFloat(amount);
  if (wallet && wallet.includes("USD")) {
    return `$${numAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `${numAmount.toFixed(8)} ${wallet?.split(" ")[0] || "CRYPTO"}`;
};
