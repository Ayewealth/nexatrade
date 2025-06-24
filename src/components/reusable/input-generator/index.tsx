import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ErrorMessage } from "@hookform/error-message";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Option } from "@/utils/types";

type InputGeneratorProps = {
  type?: "text" | "email" | "password" | "number";
  inputType: "select" | "input" | "textarea" | "otp";
  options?: Option[];
  label?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  control?: Control<any>;
  name: string;
  errors: FieldErrors<FieldValues>;
  passText?: boolean;
  className?: string;
};
const InputGenerator = ({
  inputType,
  options,
  label,
  placeholder,
  register,
  control,
  name,
  errors,
  type,
  passText,
  className,
}: InputGeneratorProps) => {
  const [viewPassword, setViewPassword] = useState(false);

  const handleViewPassword = () => {
    setViewPassword((prev) => !prev);
  };

  switch (inputType) {
    case "input":
      return (
        <div className="flex flex-col gap-1 w-full mb-4">
          <Label
            className={cn(
              "inline-flex justify-between text-[13px] sm:text-sm",
              className
            )}
            htmlFor={`input-${label}`}
          >
            <p className="space-x-0.5">
              {label && label}
              <span className="text-[#4b5563]">*</span>
            </p>
          </Label>
          <div className="w-full relative items-center">
            <Input
              id={`input-${label}`}
              placeholder={placeholder}
              type={type === "password" && viewPassword ? "text" : type}
              className={cn(
                "bg-input border-0 pr-14 placeholder:text-[13px] sm:placeholder:text-sm",
                className
              )}
              {...register(name)}
            />
            {type === "password" &&
              (viewPassword ? (
                <EyeOff
                  className="absolute top-2 right-4 h-[18px] w-[18px] cursor-pointer"
                  onClick={handleViewPassword}
                />
              ) : (
                <Eye
                  className="absolute top-2 right-4 h-[18px] w-[18px] cursor-pointer"
                  onClick={handleViewPassword}
                />
              ))}
            {type === "password" && passText && (
              <span className="text-xs text-[#4b5563]">
                Use 8 or more characters with a mix of letters, numbers &
                symbols.
              </span>
            )}
          </div>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <div className="flex items-center gap-1 w-full">
                <ChevronLeft size={13} className="text-[#dc2626]" />
                <p className="text-[#dc2626] text-xs">
                  {message === "Required" ? "" : message}
                </p>
              </div>
            )}
          />
        </div>
      );

    case "select":
      return (
        <div className="flex flex-col gap-1 w-full mb-4">
          <Label
            className={cn(
              "inline-flex justify-between text-[13px] sm:text-sm",
              className
            )}
            htmlFor={`select-${label}`}
          >
            <p className="space-x-0.5">
              {label && label}
              <span className="text-[#4b5563]">*</span>
            </p>
          </Label>

          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full bg-input border-0 placeholder:text-[13px] sm:placeholder:text-sm">
                  <SelectValue
                    placeholder={placeholder || "Select an option"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {options?.map((group, idx) => (
                    <SelectGroup key={idx}>
                      {group.label && <SelectLabel>{group.label}</SelectLabel>}
                      {group.items.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <div className="flex items-center gap-1 w-full">
                <ChevronLeft size={13} className="text-[#dc2626]" />
                <p className="text-[#dc2626] text-xs">
                  {message === "Required" ? "" : message}
                </p>
              </div>
            )}
          />
        </div>
      );

    case "textarea":
      return (
        <div className="flex flex-col gap-1 w-full mb-4">
          <Label
            className={cn(
              "inline-flex justify-between text-[13px] sm:text-sm",
              className
            )}
            htmlFor={`input-${label}`}
          >
            <p className="space-x-0.5">
              {label && label}
              <span className="text-[#4b5563]">*</span>
            </p>
          </Label>
          <Textarea
            id={`input-${label}`}
            placeholder={placeholder}
            className={cn(
              "bg-input border-0 pr-14 placeholder:text-[13px] sm:placeholder:text-sm",
              className
            )}
            {...register(name)}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <div className="flex items-center gap-1 w-full">
                <ChevronLeft size={13} className="text-[#dc2626]" />
                <p className="text-[#dc2626] text-xs">
                  {message === "Required" ? "" : message}
                </p>
              </div>
            )}
          />
        </div>
      );

    case "otp":
      return (
        <div className="flex flex-col gap-1 w-full mb-4">
          <Label
            className={cn(
              "inline-flex justify-between text-[13px] sm:text-sm",
              className
            )}
            htmlFor={`otp-${label}`}
          >
            <p className="space-x-0.5">
              {label && label}
              <span className="text-[#4b5563]">*</span>
            </p>
          </Label>

          {/* OTP input group */}
          <div className="w-full relative">
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <InputOTP
                  id={`otp-${label}`}
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                >
                  <InputOTPGroup>
                    {[...Array(6)].map((_, idx) => (
                      <InputOTPSlot key={idx} index={idx} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
          </div>

          {/* Error message */}
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <div className="flex items-center gap-1 w-full">
                <ChevronLeft size={13} className="text-[#dc2626]" />
                <p className="text-[#dc2626] text-xs">
                  {message === "Required" ? "" : message}
                </p>
              </div>
            )}
          />
        </div>
      );

    default:
      return <></>;
  }
};

export default InputGenerator;
