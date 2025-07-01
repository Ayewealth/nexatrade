"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAccessToken } from "@/utils/tokenUtils";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import { UserProfileResponse } from "@/utils/types";
import Loader from "@/components/global/loader";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/redux/store";
import { handleLogout } from "@/utils/logout";
import { setUserInfo } from "@/lib/redux/slice/authSlice";

const AuthCallback = () => {
  const [isClient, setIsClient] = useState(false);
  const token = getAccessToken();
  const router = useRouter();
  const dispatch = useDispatch();

  const { userInfo, isAuthenticated, isNewUser, isAdmin } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    setIsClient(true); // wait until the component is mounted on the client
  }, []);

  const { data: userProfile, isLoading } = useQuery<UserProfileResponse, Error>(
    {
      queryKey: ["userProfile"],
      queryFn: async () => {
        const res = await api.get<UserProfileResponse>("/auth/profile/");
        return res.data;
      },
      enabled: !!token && isClient,
    }
  );

  useEffect(() => {
    if (!isClient || isLoading) return;

    if (userProfile) {
      console.log("User Profile Data:", userProfile);
      dispatch(
        setUserInfo({
          userData: {
            id: userProfile.id,
            profile_pic: userProfile.profile_pic,
            username: userProfile.username,
            email: userProfile.email,
            full_name: userProfile.full_name,
            phone_number: userProfile.phone_number,
            address: userProfile.address,
            date_of_birth: userProfile.date_of_birth,
            kyc_status: userProfile.kyc_status,
            is_staff: userProfile.is_staff,
          },
        })
      );
      toast("Success", {
        description: "Login Successfully",
      });
      if (isAuthenticated) {
        if (userProfile.is_staff || isAdmin) {
          router.replace("/admin/home");
        } else {
          router.replace(isNewUser ? "/dashboard/profile" : "/dashboard/home");
        }
      }
    } else {
      toast.error("Error", {
        description: "Failed to fetch user profile",
      });
      router.replace("/signin");
    }

    if (!token) {
      handleLogout();
    }
  }, [
    isClient,
    isLoading,
    userProfile,
    token,
    dispatch,
    router,
    isAuthenticated,
    isNewUser,
    userInfo.userData.is_staff,
    isAdmin,
  ]);

  if (!isClient) return null;

  return (
    <div className="flex h-dvh justify-center items-center w-full">
      <Loader />
    </div>
  );
};

export default AuthCallback;
