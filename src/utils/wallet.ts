// Utility Functions
export const formatBalance = (balance: string, decimals = 8) => {
  const numBalance = Number.parseFloat(balance);
  return numBalance.toFixed(decimals);
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
