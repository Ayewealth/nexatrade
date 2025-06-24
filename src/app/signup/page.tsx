"use client";

import { Nav } from "@/components/global/navbar";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useAuthSignUp } from "@/hooks/auth";
import { SIGNUP_UP_FORMS } from "@/constants/input";
import InputGenerator from "@/components/reusable/input-generator";
import CustomButton from "@/components/reusable/button";
import { useState } from "react";

const Page = () => {
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const { errors, onInitiateUserRegistration, isPending, register } =
    useAuthSignUp();

  return (
    <>
      <Nav />
      <div className="container container-xxs container-xs mt-12 sm:mt-20">
        <div className="row justify-center">
          <div className="crypt-login-form p-[30px] w-[400px] sm:w-[480px] mt-12">
            <div className="mb-4">
              <p className="font-[Gorditas] font-bold text-3xl leading-7">
                Create Account
              </p>
            </div>
            <form>
              <div className="flex flex-col">
                {SIGNUP_UP_FORMS.map((field) => (
                  <InputGenerator
                    {...field}
                    key={field.id}
                    register={register}
                    errors={errors}
                    passText
                  />
                ))}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                    className="cursor-pointer"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-xs sm:text-sm inline-block font-normal"
                  >
                    I have read and agree to the{" "}
                    <Link href={"/terms"} className="gd-text1 font-bold">
                      Terms and condition
                    </Link>
                  </Label>
                </div>
                <CustomButton
                  agreedToTerms={agreedToTerms}
                  text="Create account"
                  loading={isPending}
                  className="w-full bg-gradient-to-r from-[#fccd4d] to-[#f8b500] hover:from-[#f8b500] hover:to-[#fccd4d] rounded-4xl mt-6"
                  onClick={onInitiateUserRegistration}
                />
              </div>
            </form>
            <div className="flex gap-2 mt-4 justify-center">
              <p className="text-[#4b5563] mb-4 text-[13px] sm:text-sm">
                Already have an account?{" "}
              </p>
              <Link
                href={"/signin"}
                className="gd-text1 font-bold text-[13px] sm:text-sm"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
