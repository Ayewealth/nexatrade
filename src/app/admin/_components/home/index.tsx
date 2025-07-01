"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/redux/store";
import {
  useAdminDepositApprove,
  useAdminKYCAction,
  useAdminTradeAction,
  useAdminWithdrawalAction,
} from "@/hooks/auth";
import Image from "next/image";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Form states
  const [depositNotes, setDepositNotes] = useState("");
  const [withdrawalNotes, setWithdrawalNotes] = useState("");
  const [withdrawalTxHash, setWithdrawalTxHash] = useState("");
  const [kycNotes, setKycNotes] = useState("");
  const [tradeAdjustmentNotes, setTradeAdjustmentNotes] = useState("");
  const [manualProfit, setManualProfit] = useState("");

  const { transactionHistoryInfo } = useAppSelector(
    (state) => state.transactionHistory
  );
  const { trades } = useAppSelector((state) => state.trading);
  const { kycs, adminActions } = useAppSelector((state) => state.admin);

  const { mutateAsync: depositAction, isPending: depositActionIsLoading } =
    useAdminDepositApprove();
  const {
    mutateAsync: withdrawalAction,
    isPending: withdrawalActionIsLoading,
  } = useAdminWithdrawalAction();

  const { mutateAsync: kycAction, isPending: kycActionIsLoading } =
    useAdminKYCAction();

  const { mutateAsync: tradeAction, isPending: tradeActionIsLoading } =
    useAdminTradeAction();

  const handleDepositAction = async (
    transactionId: number,
    action: "approve" | "reject"
  ) => {
    try {
      await depositAction({
        transaction: transactionId,
        note: depositNotes,
        action: action,
      });
      toast.success(
        `Transaction #${transactionId} has been ${action}d successfully.`
      );

      setDepositNotes("");
      // Refresh data here
    } catch (error) {
      toast.error("Failed to connect to server");
      console.error("Error During Deposit Action", error);
    }
  };

  const handleWithdrawalAction = async (
    transactionId: number,
    action: "approve" | "reject"
  ) => {
    try {
      await withdrawalAction({
        transaction: transactionId,
        withdrawalTxHash: withdrawalTxHash,
        note: withdrawalNotes,
        action: action,
      });

      toast.success(
        `Transaction #${transactionId} has been ${action}d successfully.`
      );

      setWithdrawalNotes("");
      setWithdrawalTxHash("");
      // Refresh data here
    } catch (error) {
      toast.error("Failed to connect to server");
      console.error("An Error Occured During Withdrawal Action", error);
    }
  };

  const handleKYCAction = async (
    userId: number,
    action: "approve" | "reject"
  ) => {
    try {
      await kycAction({
        user: userId,
        note: kycNotes,
        action: action,
      });

      toast(`User KYC has been ${action}d successfully.`);
      setKycNotes("");
    } catch (error) {
      toast("Failed to connect to server");
      console.error("An Error Occured During KYC Action", error);
    }
  };

  const handleTradeAdjustment = async (tradeId: number) => {
    try {
      await tradeAction({
        trade: tradeId,
        manual_profit: manualProfit,
        note: tradeAdjustmentNotes,
      });

      toast(`Trade #${tradeId} profit has been adjusted successfully.`);
      setManualProfit("");
      setTradeAdjustmentNotes("");
    } catch (error) {
      toast("Failed to connect to server");
      console.error("An Error Occured During Trade Adjustment", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage platform operations and user requests
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Admin Panel
        </Badge>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="md:grid w-full md:grid-cols-6 flex h-full flex-wrap bg-card">
          <TabsTrigger value="overview" className="bg-card">
            Overview
          </TabsTrigger>
          <TabsTrigger value="deposits" className="bg-card">
            Deposits
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="bg-card">
            Withdrawals
          </TabsTrigger>
          <TabsTrigger value="kyc" className="bg-card">
            KYC
          </TabsTrigger>
          <TabsTrigger value="trades" className="bg-card">
            Trades
          </TabsTrigger>
          <TabsTrigger value="history" className="bg-card">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Deposits
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {transactionHistoryInfo.transactionHistoryData?.filter(
                    (t) =>
                      t.transaction_type === "deposit" && t.status === "pending"
                  ).length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Withdrawals
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {transactionHistoryInfo.transactionHistoryData?.filter(
                    (t) =>
                      t.transaction_type === "withdrawal" &&
                      t.status === "pending"
                  ).length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending KYC
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {kycs.filter((k) => k.status === "pending").length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting verification
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Admin Actions</CardTitle>
                <CardDescription>
                  Latest administrative activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminActions?.slice(0, 5).map((action) => (
                    <div
                      key={action.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {action.action_type.replace("_", " ")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {action.target_user.email}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {new Date(action.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveTab("deposits")}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Review Pending Deposits (
                  {transactionHistoryInfo.transactionHistoryData?.filter(
                    (t) =>
                      t.transaction_type === "deposit" && t.status === "pending"
                  ).length || 0}
                  )
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveTab("withdrawals")}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Review Pending Withdrawals (
                  {transactionHistoryInfo.transactionHistoryData?.filter(
                    (t) =>
                      t.transaction_type === "withdrawal" &&
                      t.status === "pending"
                  ).length || 0}
                  )
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveTab("kyc")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Review KYC Applications (
                  {kycs.filter((k) => k.status === "pending").length || 0})
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deposits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Deposits</CardTitle>
              <CardDescription>
                Review and approve/reject deposit requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {transactionHistoryInfo.transactionHistoryData
                  .filter(
                    (t) =>
                      t.transaction_type === "deposit" && t.status === "pending"
                  )
                  .map((deposit) => (
                    <div
                      key={deposit.id}
                      className="border rounded-lg p-6 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">
                            Transaction #{deposit.id}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {deposit.user.full_name} ({deposit.user.email})
                          </p>
                        </div>
                        <Badge variant="secondary">{deposit.status}</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Amount</p>
                          <p className="text-muted-foreground">
                            {deposit.amount} {deposit.crypto_wallet || "USD"}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Type</p>
                          <p className="text-muted-foreground">
                            {deposit.crypto_wallet || "USD Wallet"}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">External Address</p>
                          <p className="text-muted-foreground font-mono text-xs">
                            {deposit.external_address}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Date</p>
                          <p className="text-muted-foreground">
                            {new Date(deposit.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor={`deposit-notes-${deposit.id}`}>
                            Admin Notes
                          </Label>
                          <Textarea
                            id={`deposit-notes-${deposit.id}`}
                            placeholder="Add notes about this deposit..."
                            value={depositNotes}
                            onChange={(e) => setDepositNotes(e.target.value)}
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button
                            onClick={() =>
                              handleDepositAction(deposit.id, "approve")
                            }
                            disabled={depositActionIsLoading}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleDepositAction(deposit.id, "reject")
                            }
                            disabled={depositActionIsLoading}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Withdrawals</CardTitle>
              <CardDescription>
                Review and approve/reject withdrawal requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {transactionHistoryInfo.transactionHistoryData
                  .filter(
                    (t) =>
                      t.transaction_type === "withdrawal" &&
                      t.status === "pending"
                  )
                  .map((withdrawal) => (
                    <div
                      key={withdrawal.id}
                      className="border rounded-lg p-6 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">
                            Transaction #{withdrawal.id}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {withdrawal.user.full_name}
                          </p>
                        </div>
                        <Badge variant="secondary">{withdrawal.status}</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Amount</p>
                          <p className="text-muted-foreground">
                            {withdrawal.amount}{" "}
                            {withdrawal.crypto_wallet || "USD"}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Type</p>
                          <p className="text-muted-foreground">
                            {withdrawal.crypto_wallet || "USD Wallet"}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Destination</p>
                          <p className="text-muted-foreground font-mono text-xs">
                            {withdrawal.external_address}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Date</p>
                          <p className="text-muted-foreground">
                            {new Date(
                              withdrawal.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`withdrawal-txhash-${withdrawal.id}`}>
                            Transaction Hash (for approval)
                          </Label>
                          <Input
                            id={`withdrawal-txhash-${withdrawal.id}`}
                            placeholder="Enter blockchain transaction hash..."
                            value={withdrawalTxHash}
                            onChange={(e) =>
                              setWithdrawalTxHash(e.target.value)
                            }
                            className="font-mono"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`withdrawal-notes-${withdrawal.id}`}>
                            Admin Notes
                          </Label>
                          <Textarea
                            id={`withdrawal-notes-${withdrawal.id}`}
                            placeholder="Add notes about this withdrawal..."
                            value={withdrawalNotes}
                            onChange={(e) => setWithdrawalNotes(e.target.value)}
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button
                            onClick={() =>
                              handleWithdrawalAction(withdrawal.id, "approve")
                            }
                            disabled={withdrawalActionIsLoading}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleWithdrawalAction(withdrawal.id, "reject")
                            }
                            disabled={withdrawalActionIsLoading}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending KYC Verifications</CardTitle>
              <CardDescription>
                Review and approve/reject user identity verifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {kycs
                  ?.filter((k) => k.status === "pending")
                  .map((kyc) => (
                    <div
                      key={kyc.id}
                      className="border rounded-lg p-6 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">
                            {kyc.user.full_name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {kyc.user.email}
                          </p>
                        </div>
                        <Badge variant="secondary">{kyc.status}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Submitted</p>
                          <p className="text-muted-foreground">
                            {new Date(kyc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Status</p>
                          <p className="text-muted-foreground">{kyc.status}</p>
                        </div>
                      </div>

                      <Alert className="space-y-4 w-full flex flex-col">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <AlertDescription>
                            Review uploaded documents and verify user identity
                            before approval.
                          </AlertDescription>
                        </div>

                        {/* KYC Document Image Preview */}
                        <div className="h-[150px] w-full rounded-md">
                          <Image
                            src={kyc.document}
                            alt="KYC Document"
                            width={50}
                            height={50}
                            className="w-full h-full border shadow object-contain"
                          />
                        </div>

                        {/* Download Button */}
                        <a
                          href={kyc.document}
                          download
                          className="inline-block w-fit px-4 py-2 rounded-md bg-background text-sm font-medium shadow transition"
                        >
                          Download Document
                        </a>
                      </Alert>

                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`kyc-notes-${kyc.id}`}>
                            Admin Notes
                          </Label>
                          <Textarea
                            id={`kyc-notes-${kyc.id}`}
                            placeholder="Add notes about this KYC verification..."
                            value={kycNotes}
                            onChange={(e) => setKycNotes(e.target.value)}
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button
                            onClick={() =>
                              handleKYCAction(kyc.user.id, "approve")
                            }
                            disabled={kycActionIsLoading}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve KYC
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleKYCAction(kyc.user.id, "reject")
                            }
                            disabled={kycActionIsLoading}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject KYC
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trade Profit Adjustments</CardTitle>
              <CardDescription>
                Manually adjust profits for open trades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {trades
                  .filter((t) => t.status === "open")
                  .map((trade) => (
                    <div
                      key={trade.id}
                      className="border rounded-lg p-6 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Trade #{trade.id}</h4>
                          <p className="text-sm text-muted-foreground">
                            {trade.user.full_name}({trade.user.email})
                          </p>
                        </div>
                        <Badge variant="secondary">{trade.status}</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Symbol</p>
                          <p className="text-muted-foreground">
                            {trade.market.base_currency.symbol}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Amount</p>
                          <p className="text-muted-foreground">
                            ${trade.amount}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Current Profit</p>
                          <p
                            className={`${
                              Number.parseFloat(trade.current_profit) >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            ${trade.current_profit}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Mode</p>
                          <p className="text-muted-foreground">
                            {trade.profit_calculation_mode}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`manual-profit-${trade.id}`}>
                            New Manual Profit
                          </Label>
                          <Input
                            id={`manual-profit-${trade.id}`}
                            type="number"
                            step="0.01"
                            placeholder="Enter new profit amount..."
                            value={manualProfit}
                            onChange={(e) => setManualProfit(e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`trade-notes-${trade.id}`}>
                            Admin Notes
                          </Label>
                          <Textarea
                            id={`trade-notes-${trade.id}`}
                            placeholder="Reason for profit adjustment..."
                            value={tradeAdjustmentNotes}
                            onChange={(e) =>
                              setTradeAdjustmentNotes(e.target.value)
                            }
                          />
                        </div>

                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            This will change the trade to manual profit
                            calculation mode and update the current profit.
                          </AlertDescription>
                        </Alert>

                        <Button
                          onClick={() => handleTradeAdjustment(trade.id)}
                          disabled={tradeActionIsLoading || !manualProfit}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Activity className="h-4 w-4" />
                          Adjust Profit
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Action History</CardTitle>
              <CardDescription>
                Complete log of all administrative actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminActions?.map((action) => (
                  <div key={action.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">
                          {action.action_type.replace("_", " ")}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Admin: {action.admin_user.email}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {new Date(action.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <p>
                        <strong>Target User:</strong> {action.target_user.email}
                      </p>
                      {action.notes && (
                        <p>
                          <strong>Notes:</strong> {action.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
