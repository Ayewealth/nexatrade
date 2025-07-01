"use client";

import { setIsAdmin, setIsAuthenticated } from "@/lib/redux/slice/authSlice";
import { persistor, store } from "@/lib/redux/store";
import { removeTokens } from "@/utils/tokenUtils";
import Cookies from "js-cookie";

export const handleLogout = () => {
  removeTokens();

  // Use Next.js router instead of window.location.href
  window.location.href = "/signin";

  // Clear persisted Redux store
  persistor.purge();

  // Dispatch Redux actions
  store.dispatch(setIsAuthenticated(false));
  store.dispatch(setIsAdmin(false));
  Cookies.remove("isAdmin");

  console.log("User Logout");
};
