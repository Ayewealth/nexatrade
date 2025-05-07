"use client";

import { Nav } from "@/components/global/navbar";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
                <div className="flex flex-col mb-4">
                  <Label
                    htmlFor="name"
                    className="inline-block text-[13px] sm:text-sm pb-[4px]"
                  >
                    Fullname
                    <span className="text-[#4b5563]">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Fullname"
                    className="bg-input border-0 placeholder:text-[13px] sm:placeholder:text-sm"
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <Label
                    htmlFor="email"
                    className="inline-block text-[13px] sm:text-sm pb-[4px]"
                  >
                    Email Address
                    <span className="text-[#4b5563]">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Email"
                    className="bg-input border-0 placeholder:text-[13px] sm:placeholder:text-sm"
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <Label
                    htmlFor="password"
                    className="inline-block text-[13px] sm:text-sm pb-[4px]"
                  >
                    Password
                    <span className="text-[#4b5563]">*</span>
                  </Label>
                  <div className="w-full relative items-center">
                    <Input
                      type={showPassword === true ? "text" : "password"}
                      id="password"
                      placeholder="Password"
                      className="bg-input border-0 pr-14 placeholder:text-[13px] sm:placeholder:text-sm"
                    />
                    {showPassword === true ? (
                      <EyeOff
                        className="absolute top-2 right-4 h-[18px] w-[18px] cursor-pointer"
                        onClick={togglePasswordVisibility}
                      />
                    ) : (
                      <Eye
                        className="absolute top-2 right-4 h-[18px] w-[18px] cursor-pointer"
                        onClick={togglePasswordVisibility}
                      />
                    )}
                    <span className="text-xs text-[#4b5563]">
                      Use 8 or more characters with a mix of letters, numbers &
                      symbols.
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
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
                <Button className="bg-gradient-to-r from-[#fccd4d] to-[#f8b500] hover:from-[#f8b500] hover:to-[#fccd4d] text-white font-medium py-2 md:py-3 px-4 md:px-6 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer text-sm md:text-sm rounded-4xl mt-6">
                  Create Account
                </Button>
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
