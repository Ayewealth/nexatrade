"use client";

import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/redux/store";
import { cn } from "@/lib/utils";
import { Save, UserPen } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Kyc from "../_components/profile/kyc";
import ChangePassword from "../_components/profile/change-password";
import Account from "../_components/profile/account";
import { toast } from "sonner";
import { useUpdateProfilePicture } from "@/hooks/auth";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/utils/queries";
import { setUserInfo } from "@/lib/redux/slice/authSlice";
import { getKycStatus } from "@/actions/auth";
import { setKycInfo } from "@/lib/redux/slice/kycSlice";

const Page = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  const { data, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  const { data: kycData } = useQuery({
    queryKey: ["kycDocument"],
    queryFn: getKycStatus,
  });

  const { mutateAsync, isPending } = useUpdateProfilePicture();

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("email", userInfo.userData.email || "");
    formData.append("profile_pic", selectedImage);

    try {
      await mutateAsync(formData);
      toast.success("Profile picture updated successfully");

      setSelectedImage(null);
      setPreviewImage(null);
    } catch (error) {
      toast.error("Error updating profile picture");
      console.error(error);
    }
  };

  useEffect(() => {
    if (data) {
      dispatch(
        setUserInfo({
          userData: {
            id: data.id,
            profile_pic: data.profile_pic,
            username: data.username,
            email: data.email,
            full_name: data.full_name,
            phone_number: data.phone_number,
            address: data.address,
            date_of_birth: data.date_of_birth,
            kyc_status: data.kyc_status,
          },
        })
      );
    }

    if (kycData) {
      dispatch(
        setKycInfo({
          kycData: {
            id: kycData.id,
            user: kycData.user,
            document_type: kycData.document_type,
            document: kycData.document,
            uploaded_at: kycData.uploaded_at,
            status: kycData.status,
          },
        })
      );
    }
  }, [data, dispatch, kycData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row w-full gap-2 p-4 overflow-y-auto">
      <div className="bg-card rounded-2xl px-4 pt-[62px] pb-8 lg:w-[50%] w-full overflow-hidden relative h-fit">
        <div className="absolute top-0 left-0 right-0 h-[120px]">
          <Image
            src="/assets/bg-profile.png"
            alt="profile-bg"
            width={100}
            height={100}
            priority
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-0 left-0 right-0 h-[120px] w-full bg-black/50 z-10" />

        <div className="relative mb-[50px] z-30">
          <div className="w-[125px] h-[125px] rounded-full overflow-hidden border-2 border-white mb-[20px]">
            <Image
              src={
                previewImage ||
                userInfo.userData?.profile_pic ||
                "/assets/default.jpg"
              }
              alt="User"
              width={125}
              height={125}
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="font-[Gorditas] font-bold text-[24px] leading-8 text-foreground">
            {userInfo.userData?.full_name}
          </h4>
          <p className="font-[Gorditas] text-[14px] leading-6 text-foreground">
            {userInfo.userData?.email}
          </p>
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <div className="flex items-center gap-1 md:flex-row flex-col">
          <Button
            className={cn(
              "py-3 cursor-pointer font-semibold flex items-center gap-2",
              previewImage ? "md:w-[75%] w-full" : "w-full"
            )}
            onClick={handleImageClick}
            disabled={isPending}
          >
            <UserPen />
            {isPending ? "Uploading..." : "Change Profile Picture"}
          </Button>

          {previewImage && (
            <Button
              className="md:w-[25%] w-full bg-gradient-to-r from-[#fccd4d] to-[#f8b500] hover:from-[#f8b500] hover:to-[#fccd4d] text-white cursor-pointer font-semibold flex items-center gap-2"
              onClick={handleSave}
              disabled={isPending}
            >
              <Save />
              {isPending ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
      </div>

      <div className="bg-card rounded-2xl p-4 w-full h-fit">
        <Tabs defaultValue="account" className="w-full gap-4">
          <TabsList className="bg-transparent flex-wrap">
            <TabsTrigger value="account" className="cursor-pointer">
              Account
            </TabsTrigger>
            <TabsTrigger value="password" className="cursor-pointer">
              Change Password
            </TabsTrigger>
            <TabsTrigger value="kyc" className="cursor-pointer">
              Kyc Verification
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Account />
          </TabsContent>
          <TabsContent value="password">
            <ChangePassword />
          </TabsContent>
          <TabsContent value="kyc" className="mt-6 md:mt-0">
            <Kyc />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
