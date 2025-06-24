import { AuthFormProps } from "@/utils/types";

export const SIGNUP_UP_FORMS: AuthFormProps[] = [
  {
    id: "1",
    label: "Full Name",
    inputType: "input",
    placeholder: "Full name",
    name: "fullname",
    type: "text",
  },
  {
    id: "2",
    label: "Email Address",
    inputType: "input",
    placeholder: "Email address",
    name: "email",
    type: "email",
  },
  {
    id: "3",
    label: "Password",
    inputType: "input",
    placeholder: "Password",
    name: "password",
    type: "password",
  },
];

export const SIGNIN_FORMS: AuthFormProps[] = [
  {
    id: "1",
    label: "Email Address",
    inputType: "input",
    placeholder: "Email address",
    name: "email",
    type: "email",
  },
  {
    id: "2",
    label: "Password",
    inputType: "input",
    placeholder: "Password",
    name: "password",
    type: "password",
  },
];

export const FORGET_PASSWORD_FORMS_STEP_1: AuthFormProps[] = [
  {
    id: "1",
    label: "Email Address",
    inputType: "input",
    placeholder: "Email address",
    name: "email",
    type: "email",
  },
];

export const FORGET_PASSWORD_FORMS_STEP_2: AuthFormProps[] = [
  {
    id: "1",
    label: "OTP",
    inputType: "otp",
    name: "otp",
  },
  {
    id: "2",
    label: "New Password",
    inputType: "input",
    placeholder: "New password",
    name: "password",
    type: "password",
  },
];
