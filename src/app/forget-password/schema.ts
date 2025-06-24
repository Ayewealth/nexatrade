import { z } from "zod";

export const ForgetPasswordStep1Schema = z.object({
  email: z
    .string()
    .email("You must give a valid email")
    .min(1, "Email is required")
    .refine(
      (value) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value ?? ""),
      "Invalid email format"
    ),
});

export const ForgetPasswordStep2Schema = z.object({
  email: z
    .string()
    .email("You must give a valid email")
    .min(1, "Email is required")
    .refine(
      (value) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value ?? ""),
      "Invalid email format"
    ),
  otp: z.string().min(6, "Token must be at least 6 digits"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(64, {
      message: "Password cannot be longer than 64 characters",
    })
    .refine(
      (value) => /^[a-zA-Z0-9_.-]*$/.test(value ?? ""),
      "Password should contain only alphabets and numbers"
    ),
});
