export type AuthFormProps = {
  id: string;
  type?: "text" | "email" | "password" | "number";
  inputType: "select" | "input" | "textarea" | "otp";
  options?: Option[];
  label?: string;
  placeholder?: string;
  name: string;
};
export type Option = {
  label: string;
  items: { label: string; value: string }[];
};
export interface UserProfileResponse {
  id: number;
  username: string;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  date_of_birth: string;
  kyc_status: string;
  profile_pic: string;
}

export interface Transaction {
  id: number;
  user: number | null;
  transaction_type: "deposit" | "withdrawal" | null;
  crypto_wallet: string | null;
  usd_wallet: string | null;
  amount: string;
  status: "pending" | "approved" | "rejected" | "completed" | null;
  external_address: string | null;
  created_at: string;
  updated_at: string;
  notes: string | null;
}

export interface WalletInterface {
  id: number;
  user: number;
  crypto_type: {
    id: number;
    name: string;
    symbol: string;
    logo_url: string;
    is_active: boolean;
  };
  wallet_address: string;
  balance: string;
  is_active: boolean;
  created_at: string;
}

export interface USDWallet {
  id: number;
  user: number;
  balance: string;
  is_active: boolean;
  created_at: string;
}

export interface WalletUSDValue {
  wallet_id: number;
  crypto_symbol: string;
  crypto_name: string;
  crypto_balance: string;
  current_price_usd?: number;
  total_usd_value?: number;
  wallet_address: string;
  market_available?: boolean;
  error?: string;
}

export interface PortfolioSummary {
  portfolio_summary: {
    total_portfolio_value_usd: number;
    usd_balance: number;
    crypto_portfolio_value_usd: number;
    usd_percentage: number;
    crypto_percentage: number;
  };
  usd_wallet: {
    balance: number;
  };
  crypto_portfolio: Array<{
    crypto_symbol: string;
    crypto_name: string;
    balance: string;
    current_price_usd?: number;
    usd_value?: number;
    percentage_of_total_portfolio: number;
    percentage_of_crypto_portfolio: number;
    market_available?: boolean;
  }>;
  total_crypto_wallets: number;
}

export interface RegisterSuccessResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    full_name: string;
    email: string;
    phone_number: string;
    address: string;
    date_of_birth: string;
    kyc_status: string;
    profile_pic: string;
  };
}

export interface LoginSuccessResponse {
  access: string;
  refresh: string;
}
export interface ResetPasswordSuccessResponse {
  detail: string;
}

export interface UserProfilePictureResponse {
  id: number;
  email: string | null;
  username: string | null;
  full_name: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  address: string | null;
  kyc_status: string | null;
  profile_pic: string | null;
}

export interface KycResponse {
  id: number;
  user: number | null;
  document_type: string | null;
  document: string | null;
  uploaded_at: string | null;
  status: string | null;
}

export interface CreateDepositTransactionResponse {
  id: number;
  user: number;
  transaction_type: string;
  crypto_wallet: string;
  usd_wallet: number | null;
  amount: string;
  status: string;
  external_address: string;
  created_at: string;
  updated_at: string;
  note: string | null;
}

export interface Market {
  id: number;
  name: string;
  base_currency: {
    id: number;
    name: string;
    symbol: string;
    logo_url: string;
    is_active: true;
  };
  quote_currency: string;
  is_active: boolean;
  current_price: string;
  min_trade_amount: string;
  price_change_24h: 0.55;
  volume_24h: string;
  high_24h: string;
  low_24h: string;
}

export interface Trade {
  id: number;
  user: number;
  market: {
    id: number;
    name: string;
    base_currency: {
      name: string;
      symbol: string;
      logo_url: string;
      is_active: boolean;
    };
    quote_currency: string;
    is_active: boolean;
    current_price: string;
    min_trade_amount: string;
  };
  trade_type: string;
  amount: string;
  price: string;
  leverage: number;
  take_profit: string | null;
  stop_loss: string | null;
  status: string;
  profit_calculation_mode: string;
  manual_profit: string | null;
  current_profit: string;
  created_at: string;
  closed_at: string | null;
}

export interface Package {
  id: number;
  name: string;
  description: string;
  min_investment: string;
  max_investment: string;
  duration_days: string;
  profit_percentage: string;
  is_active: boolean;
  risk_level: string;
  features: [];
  max_trades_per_day: number;
  trade_frequency_hours: number;
  preferred_markets: [];
}

export interface AutoTrade {
  id: number;
  trade: Trade;
  created_at: string;
}

export interface Subscription {
  id: number;
  package: Package;
  investment_amount: string;
  expected_profit: string;
  total_profit_earned: string;
  profit_progress_percentage: number;
  status: string;
  is_auto_trading_active: boolean;
  start_date: string;
  end_date: string;
  auto_trades: AutoTrade[];
}
