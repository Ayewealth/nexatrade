import CustomButton from "@/components/reusable/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateProfile } from "@/hooks/auth";
import { useAppSelector } from "@/lib/redux/store";
import React, { useState } from "react";
import { toast } from "sonner";

const Account = () => {
  const { userInfo } = useAppSelector((state) => state.auth);

  const [fullName, setFullName] = useState(userInfo.userData?.full_name);
  const [userName, setUsername] = useState(userInfo.userData?.username);
  const [email, setEmail] = useState(userInfo.userData?.email);
  const [address, setAddress] = useState(userInfo.userData?.address);
  const [dateOfBirth, setDateOfBirth] = useState(
    userInfo.userData?.date_of_birth
  );
  const [phoneNumber, setPhoneNumber] = useState(
    userInfo.userData?.phone_number
  );

  const { mutateAsync, isPending } = useUpdateProfile();

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("email", userInfo.userData?.email || "");
    formData.append("full_name", fullName);
    formData.append("username", userName);
    formData.append("phone_number", phoneNumber);
    formData.append("address", address);
    formData.append("date_of_birth", dateOfBirth);

    try {
      await mutateAsync(formData);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error updating profile");
      console.error(error);
    }
  };

  return (
    <form>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between gap-4 md:flex-row flex-col">
          <div className="w-full flex flex-col gap-1">
            <Label className="inline-flex justify-between text-[13px] sm:text-sm">
              Full Name
            </Label>
            <Input
              placeholder="Full name"
              type="text"
              className="bg-input border-0 placeholder:text-[13px] sm:placeholder:text-sm"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <Label className="inline-flex justify-between text-[13px] sm:text-sm">
              User Name
            </Label>
            <Input
              placeholder="User name"
              type="text"
              className="bg-input border-0 placeholder:text-[13px] sm:placeholder:text-sm"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 md:flex-row flex-col">
          <div className="w-full flex flex-col gap-1">
            <Label className="inline-flex justify-between text-[13px] sm:text-sm">
              Email Address
            </Label>
            <Input
              placeholder="Email address"
              type="email"
              className="bg-input border-0 placeholder:text-[13px] sm:placeholder:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
              readOnly
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <Label className="inline-flex justify-between text-[13px] sm:text-sm">
              Phone Number
            </Label>
            <Input
              placeholder="Phone number"
              type="tel"
              className="bg-input border-0 placeholder:text-[13px] sm:placeholder:text-sm"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 md:flex-row flex-col">
          <div className="w-full flex flex-col gap-1">
            <Label className="inline-flex justify-between text-[13px] sm:text-sm">
              Address
            </Label>
            <Input
              placeholder="Address"
              type="text"
              className="bg-input border-0 placeholder:text-[13px] sm:placeholder:text-sm"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <Label className="inline-flex justify-between text-[13px] sm:text-sm">
              Date of birth
            </Label>
            <Input
              placeholder="Date of birth"
              type="date"
              className="bg-input border-0 placeholder:text-[13px] sm:placeholder:text-sm"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full flex items-center justify-end">
          <CustomButton
            text={isPending ? "Saving..." : "Save Changes"}
            loading={isPending}
            className="bg-gradient-to-r from-[#fccd4d] to-[#f8b500] hover:from-[#f8b500] hover:to-[#fccd4d] rounded-md w-fit flex justify-center items-center"
            onClick={handleSave}
            isDisabled={isPending}
            type="button"
          />
        </div>
      </div>
    </form>
  );
};

export default Account;
