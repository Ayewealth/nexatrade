"use client";

import { clearUserInfo, setIsAuthenticated } from "@/lib/redux/slice/authSlice";
import { resetWalletState } from "@/lib/redux/slice/walletSlice";
import { persistor, store } from "@/lib/redux/store";
import { removeTokens } from "@/utils/tokenUtils";

export const handleLogout = () => {
  removeTokens();

  // Use Next.js router instead of window.location.href
  window.location.href = "/signin";

  // Clear persisted Redux store
  persistor.purge();

  // Dispatch Redux actions
  store.dispatch(clearUserInfo());
  store.dispatch(setIsAuthenticated(false));
  store.dispatch(resetWalletState());

  console.log("User Logout");
};
