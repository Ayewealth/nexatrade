import Cookies from "js-cookie";

// Store tokens
export const setTokens = (access: string, refresh: string) => {
  Cookies.set("nexatrade-access", access, { expires: 5 }); // Access token expires in 5 days
  Cookies.set("nexatrade-refresh", refresh, { expires: 10 }); // Refresh token expires in 10 days
};

// Retrieve tokens
export const getAccessToken = () => Cookies.get("nexatrade-access");
export const getRefreshToken = () => Cookies.get("nexatrade-refresh");

// Remove tokens
export const removeTokens = () => {
  Cookies.remove("nexatrade-access");
  Cookies.remove("nexatrade-refresh");
};
