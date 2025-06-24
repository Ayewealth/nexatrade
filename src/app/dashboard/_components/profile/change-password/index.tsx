import CustomButton from "@/components/reusable/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "@/hooks/auth";
import React, { useState } from "react";
import { toast } from "sonner";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { mutateAsync, isPending } = useChangePassword();

  const handleSave = async () => {
    try {
      await mutateAsync({ oldPassword, newPassword });
      toast.success("Password changed successfully");

      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error("Error changing password");
      console.error(error);
    }
  };

  return (
    <form>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between gap-4 md:flex-row flex-col">
          <div className="w-full flex flex-col gap-1">
            <Label className="inline-flex justify-between text-[13px] sm:text-sm">
              Old Password
            </Label>
            <Input
              placeholder="Old password"
              type="password"
              className="bg-input border-0 pr-14 placeholder:text-[13px] sm:placeholder:text-sm"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <Label className="inline-flex justify-between text-[13px] sm:text-sm">
              New Password
            </Label>
            <Input
              placeholder="New password"
              type="password"
              className="bg-input border-0 pr-14 placeholder:text-[13px] sm:placeholder:text-sm"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full flex items-center justify-end">
          <CustomButton
            text="Update Password"
            loading={isPending}
            className="bg-gradient-to-r from-[#fccd4d] to-[#f8b500] hover:from-[#f8b500] hover:to-[#fccd4d] rounded-md w-fit flex items-center justify-center"
            onClick={handleSave}
            type="button"
          />
        </div>
      </div>
    </form>
  );
};

export default ChangePassword;
