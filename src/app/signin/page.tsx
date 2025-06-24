"use client";

import { Nav } from "@/components/global/navbar";
import CustomButton from "@/components/reusable/button";
import InputGenerator from "@/components/reusable/input-generator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SIGNIN_FORMS } from "@/constants/input";
import { useAuthSignIn } from "@/hooks/auth";
import { useAppSelector } from "@/lib/redux/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { errors, onAuthenticateUser, isPending, register } = useAuthSignIn();

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === true) router.replace("/auth-callback");
  }, [isAuthenticated, router]);

  return (
    <>
      <Nav />
      <div className="container container-xxs container-xs mt-12 sm:mt-20">
        <div className="row justify-center">
          <div className="crypt-login-form p-[30px] w-[400px] sm:w-[480px] mt-12">
            <div className="mb-4">
              <p className="font-[Gorditas] font-bold text-3xl leading-7">
                Log In
              </p>
            </div>
            <form>
              <div className="flex flex-col">
                {SIGNIN_FORMS.map((field) => (
                  <InputGenerator
                    {...field}
                    key={field.id}
                    register={register}
                    errors={errors}
                    passText
                  />
                ))}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label
                      htmlFor="terms"
                      className="text-xs sm:text-sm inline-block font-normal"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Link
                    href={"/forget-password"}
                    className="gd-text1 font-bold text-xs sm:text-sm"
                  >
                    Forgot password?
                  </Link>
                </div>
                <CustomButton
                  text="Log in"
                  loading={isPending}
                  className="w-full bg-gradient-to-r from-[#fccd4d] to-[#f8b500] hover:from-[#f8b500] hover:to-[#fccd4d] rounded-4xl mt-6"
                  onClick={onAuthenticateUser}
                />
              </div>
            </form>
            <div className="flex gap-2 mt-4 justify-center">
              <p className="text-[#4b5563] mb-4 text-[13px] sm:text-sm">
                Don&apos;t have an account?{" "}
              </p>
              <Link
                href={"/signup"}
                className="gd-text1 font-bold text-[13px] sm:text-sm"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
