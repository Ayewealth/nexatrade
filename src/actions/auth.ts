import api from "@/api";
import {
  LoginSuccessResponse,
  CreateDepositTransactionResponse,
  KycResponse,
  PortfolioSummary,
  ResetPasswordSuccessResponse,
  Transaction,
  USDWallet,
  UserProfilePictureResponse,
  WalletInterface,
  WalletUSDValue,
  RegisterSuccessResponse,
} from "@/utils/types";

type RegisterResponse = RegisterSuccessResponse;
type RegisterProps = {
  full_name: string;
  email: string;
  password: string;
};
export const registerUser = async ({
  full_name,
  email,
  password,
}: RegisterProps): Promise<RegisterResponse> => {
  const { data } = await api.post("/auth/register/", {
    email,
    full_name,
    password,
  });

  return data;
};

type LoginResponse = LoginSuccessResponse;

type LoginProps = {
  email: string;
  password: string;
};
export const loginUser = async ({
  email,
  password,
}: LoginProps): Promise<LoginResponse> => {
  const { data } = await api.post("/auth/login/", {
    email,
    password,
  });

  return data;
};

type ResetPasswordResponse = ResetPasswordSuccessResponse;

type resetPasswordProps = {
  email: string;
};
export const resetPassword = async ({
  email,
}: resetPasswordProps): Promise<ResetPasswordResponse> => {
  const { data } = await api.post("/auth/password-reset/request/", {
    email,
  });

  return data;
};

type resetPasswordConfirmProps = {
  email: string;
  otp: string;
  password: string;
};

export const resetPasswordConfirm = async ({
  email,
  otp,
  password,
}: resetPasswordConfirmProps): Promise<ResetPasswordResponse> => {
  const { data } = await api.post("/auth/password-reset/confirm/", {
    email,
    otp,
    new_password: password,
  });

  return data;
};
export const updateProfile = async (
  formData: FormData
): Promise<UserProfilePictureResponse> => {
  const { data } = await api.patch("/auth/profile/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

type passwordChangeProps = {
  oldPassword: string;
  newPassword: string;
};

interface PasswordChangeResponse {
  detail: string;
}

export const changePassword = async ({
  oldPassword,
  newPassword,
}: passwordChangeProps): Promise<PasswordChangeResponse> => {
  const { data } = await api.patch("/auth/change-password/", {
    old_password: oldPassword,
    new_password: newPassword,
  });

  return data;
};

export const kyc = async (formData: FormData): Promise<KycResponse> => {
  const { data } = await api.post("/auth/kyc/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const getKycStatus = async (): Promise<KycResponse> => {
  const { data } = await api.get("/auth/kyc/");

  return data;
};

export const getTransactionHistory = async (): Promise<Transaction[]> => {
  const { data } = await api.get("/wallet/transactions/");

  return data;
};

export const getWallets = async (): Promise<WalletInterface[]> => {
  const { data } = await api.get("/wallet/crypto-wallets/");

  return data;
};

export const getUSDWallet = async (): Promise<USDWallet[]> => {
  const { data } = await api.get("/wallet/usd-wallets/");

  return data;
};

export const getWalletUSDValues = async (): Promise<WalletUSDValue[]> => {
  const { data } = await api.get("/wallet/transactions/wallet-usd-value/");
  return data.wallets;
};

export const getPortfolioSummary = async (): Promise<PortfolioSummary> => {
  const { data } = await api.get("/wallet/transactions/portfolio-summary/");
  return data;
};

type convertProps = {
  crypto_wallet: number;
  amount: string;
};
export const convertCryptoToUSD = async ({
  crypto_wallet,
  amount,
}: convertProps) => {
  const { data } = await api.post("/wallet/transactions/convert-to-usd/", {
    crypto_wallet: crypto_wallet,
    amount: amount,
  });

  return data;
};

export const convertUSDToCrypto = async ({
  crypto_wallet,
  amount,
}: convertProps) => {
  const { data } = await api.post("/wallet/transactions/convert-to-crypto/", {
    crypto_wallet: crypto_wallet,
    usd_amount: amount,
  });

  return data;
};

export const createDepositTransaction = async (
  crypto_wallet: number,
  amount: string
): Promise<CreateDepositTransactionResponse> => {
  const { data } = await api.post("/wallet/transactions/deposit/", {
    crypto_wallet,
    amount,
  });

  return data;
};

export const createWithdrawalTransaction = async (
  crypto_wallet: number,
  amount: string,
  external_address: string
): Promise<CreateDepositTransactionResponse> => {
  const { data } = await api.post("/wallet/transactions/withdraw/", {
    crypto_wallet,
    amount,
    external_address,
  });

  return data;
};
