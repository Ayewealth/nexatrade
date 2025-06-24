// utils/queries.ts
import api from "@/api";
import { UserProfileResponse } from "@/utils/types";

export const getUserProfile = async () => {
  const res = await api.get<UserProfileResponse>("/auth/profile/");
  if (!res.data) {
    throw new Error("Failed to fetch user profile");
  }
  return res.data;
};
