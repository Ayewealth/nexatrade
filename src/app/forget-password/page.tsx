"use client";

import { Nav } from "@/components/global/navbar";
import CustomButton from "@/components/reusable/button";
import InputGenerator from "@/components/reusable/input-generator";
import {
  FORGET_PASSWORD_FORMS_STEP_1,
  FORGET_PASSWORD_FORMS_STEP_2,
} from "@/constants/input";
import { useAuthForgetPassword } from "@/hooks/auth";
import React, { useState } from "react";

const Page = () => {
  const [step, setStep] = useState(1);

  const { isPending, register, errors, onSubmitStep, control } =
    useAuthForgetPassword({
      step,
      setStep,
    });

  const renderFields = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="mb-4">
              <p className="font-[Gorditas] font-bold text-3xl leading-7">
                Forget Password
              </p>
            </div>
            <div className="flex flex-col">
              {FORGET_PASSWORD_FORMS_STEP_1.map((field) => (
                <InputGenerator
                  {...field}
                  key={field.id}
                  errors={errors}
                  register={register}
                />
              ))}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="mb-4">
              <p className="font-[Gorditas] font-bold text-3xl leading-7">
                Reset Password
              </p>
              <span className="text-xs text-[#4b5563]">
                A 6 digit otp was sent to your email, input that otp here and
                reset your password
              </span>
            </div>
            <div className="flex flex-col">
              {FORGET_PASSWORD_FORMS_STEP_2.map((field) => (
                <InputGenerator
                  {...field}
                  key={field.id}
                  errors={errors}
                  register={register}
                  control={control}
                />
              ))}
            </div>
          </>
        );
      default:
        return null;
    }
  };
  return (
    <>
      <Nav />
      <div className="container container-xxs container-xs mt-12 sm:mt-20">
        <div className="row justify-center">
          <div className="crypt-login-form p-[30px] w-[400px] sm:w-[480px] mt-12">
            {renderFields()}
            <CustomButton
              className="w-full bg-gradient-to-r from-[#fccd4d] to-[#f8b500] hover:from-[#f8b500] hover:to-[#fccd4d] rounded-4xl mt-6"
              text={step === 1 ? "Reset password" : "Create password"}
              loading={isPending}
              onClick={onSubmitStep}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
