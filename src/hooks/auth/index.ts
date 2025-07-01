import { z } from "zod";
import Cookies from "js-cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { setTokens } from "@/utils/tokenUtils";
import { useDispatch } from "react-redux";
import { SignUpSchema } from "@/app/signup/schema";
import {
  changePassword,
  closeTrade,
  convertCryptoToUSD,
  convertUSDToCrypto,
  createDepositTransaction,
  createWithdrawalTransaction,
  getKycStatus,
  getTransactionHistory,
  kyc,
  loginUser,
  placeTrade,
  registerUser,
  resetPassword,
  resetPasswordConfirm,
  subscribePackage,
  updateProfile,
} from "@/actions/auth";
import {
  setIsAuthenticated,
  setIsNewUser,
  setUserInfo,
} from "@/lib/redux/slice/authSlice";
import { SignInSchema } from "@/app/signin/schema";
import {
  ForgetPasswordStep1Schema,
  ForgetPasswordStep2Schema,
} from "@/app/forget-password/schema";

type SignupFormData = {
  fullname: string;
  email: string;
  password: string;
};

export const useAuthSignUp = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    getValues,
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    mode: "onBlur",
  });

  const HandleSubmit = async (data: SignupFormData) => {
    const step1Data = data;
    const response = registerUser({
      full_name: step1Data.fullname,
      email: step1Data.email,
      password: step1Data.password,
    });

    return response;
  };

  const { mutate: submitStep, isPending } = useMutation({
    mutationFn: (data: SignupFormData) => HandleSubmit(data),
    onSuccess: (data) => {
      toast("Success", {
        description: "Account created successfully.",
      });

      reset();
      Cookies.set("isNewUser", "true", {
        expires: 365 * 10,
      });
      setTokens(data.access, data.refresh);

      dispatch(setIsAuthenticated(true));
      dispatch(setIsNewUser(true));
      dispatch(setUserInfo({ userData: data.user }));

      router.replace("/auth-callback");
    },
    onError: (error) => {
      const errorMessage =
        error?.message ?? "An error occurred while creating your account.";
      toast("Registration Failed", {
        description: errorMessage,
      });
    },
  });

  const onInitiateUserRegistration = handleSubmit(async (data) => {
    const stepData = data;
    submitStep({
      fullname: stepData.fullname,
      email: stepData.email,
      password: stepData.password,
    });
  });

  return { errors, onInitiateUserRegistration, isPending, register, getValues };
};

type UseAuthSignInProps = {
  email: string;
  password: string;
};

export const useAuthSignIn = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    getValues,
  } = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    mode: "onBlur",
  });

  const onAuth = async (data: UseAuthSignInProps) => {
    const response = loginUser({
      email: data.email,
      password: data.password,
    });

    return response;
  };

  const { mutate: InitiateLoginFlow, isPending } = useMutation({
    mutationFn: async (data: UseAuthSignInProps) => onAuth(data),
    onSuccess: async (data) => {
      toast("Success", {
        description: "Login successful.",
      });

      setTokens(data.access, data.refresh);
      dispatch(setIsAuthenticated(true));
      reset();
      router.push("/auth-callback");
    },
    onError: (error) => {
      const errorMessage =
        error?.message ?? "An error occurred while logging in.";
      toast("Login Failed", {
        description: errorMessage,
      });
    },
  });

  const onAuthenticateUser = handleSubmit(async (values) => {
    InitiateLoginFlow({ email: values.email, password: values.password });
  });

  return { errors, onAuthenticateUser, isPending, register, getValues };
};

type UseAuthForgetPasswordProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

type ForgetPasswordFormDataStep1 = {
  email: string;
};

type ForgetPasswordFormDataStep2 = {
  email: string;
  otp: string;
  password: string;
};

type ForgetPasswordFormData =
  | ForgetPasswordFormDataStep1
  | ForgetPasswordFormDataStep2;

export const useAuthForgetPassword = ({
  step,
  setStep,
}: UseAuthForgetPasswordProps) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    getValues,
    control,
  } = useForm<
    z.infer<typeof ForgetPasswordStep1Schema | typeof ForgetPasswordStep2Schema>
  >({
    resolver: zodResolver(
      step === 1 ? ForgetPasswordStep1Schema : ForgetPasswordStep2Schema
    ),
    mode: "onBlur",
  });

  const router = useRouter();

  const handleStepSubmit = async (data: ForgetPasswordFormData) => {
    if (step === 1) {
      const response = resetPassword({
        email: data.email,
      });

      return response;
    } else {
      const step2Data = data as ForgetPasswordFormDataStep2;
      const response = resetPasswordConfirm({
        email: step2Data.email,
        otp: step2Data.otp,
        password: step2Data.password,
      });

      return response;
    }
  };

  const { mutate: submitStep, isPending } = useMutation({
    mutationFn: (data: ForgetPasswordFormData) => handleStepSubmit(data),
    onSuccess: (data) => {
      toast("Success", {
        description: data.detail,
      });
      if (step < 2) {
        setStep((prev) => prev + 1);
      } else {
        reset();
        router.replace("/signin");
      }
    },
    onError: (error) => {
      const errorMessage =
        error?.message ?? "An error occurred while processing your request.";
      setStep(1); // Reset to step 1 on error
      toast("Password Reset Failed", {
        description: errorMessage,
      });
    },
  });

  const onSubmitStep = handleSubmit((data) => {
    if (step === 1) {
      const stepData = data as ForgetPasswordFormDataStep1;
      submitStep({
        email: stepData.email,
      });
    } else {
      const stepData = data as ForgetPasswordFormDataStep2;
      submitStep({
        email: stepData.email,
        otp: stepData.otp,
        password: stepData.password,
      });
    }
  });

  return { register, errors, isPending, onSubmitStep, getValues, control };
};

export function useUpdateProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useUploadKyc() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: kyc,
    onSuccess: () => {
      Cookies.set("isNewUser", "false", {
        expires: 365 * 10,
      });
      dispatch(setIsNewUser(false));
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["kycDocument"] });
    },
  });
}

export const useGetKycDocuments = () => {
  return useQuery({
    queryKey: ["kycDocument"],
    queryFn: getKycStatus,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetTransactionHistory = () => {
  return useQuery({
    queryKey: ["transactionHistory"],
    queryFn: getTransactionHistory,
    staleTime: 5 * 60 * 1000,
  });
};

export function useCreateDepositTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      crypto_wallet,
      amount,
    }: {
      crypto_wallet: number;
      amount: string;
    }) => createDepositTransaction(crypto_wallet, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usdWallet"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });
}
export function useCreateWithdrawalTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      crypto_wallet,
      amount,
      external_address,
    }: {
      crypto_wallet: number;
      amount: string;
      external_address: string;
    }) => createWithdrawalTransaction(crypto_wallet, amount, external_address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usdWallet"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });
}

export function useConvertCryptoToUSD() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      crypto_wallet,
      amount,
    }: {
      crypto_wallet: number;
      amount: string;
    }) => convertCryptoToUSD({ crypto_wallet, amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["usdWallet"] });
      queryClient.invalidateQueries({ queryKey: ["walletUSDValues"] });
      queryClient.invalidateQueries({ queryKey: ["portfolioSummary"] });
    },
  });
}

export function useConvertUSDToCrypto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      crypto_wallet,
      amount,
    }: {
      crypto_wallet: number;
      amount: string;
    }) => convertUSDToCrypto({ crypto_wallet, amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["usdWallet"] });
      queryClient.invalidateQueries({ queryKey: ["walletUSDValues"] });
      queryClient.invalidateQueries({ queryKey: ["portfolioSummary"] });
    },
  });
}

export function usePlaceTrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      market,
      trade_type,
      amount,
      leverage,
      take_profit,
      stop_loss,
    }: {
      market: number;
      trade_type: string;
      amount: string;
      leverage: number;
      take_profit: number;
      stop_loss: number;
    }) =>
      placeTrade({
        market,
        trade_type,
        amount,
        leverage,
        take_profit,
        stop_loss,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
    },
  });
}

export function useCloseTrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tradeId: number) => closeTrade(tradeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
    },
  });
}

export function useSubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      package_id,
      investment_amount,
    }: {
      package_id: number;
      investment_amount: string;
    }) => subscribePackage({ package_id, investment_amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}
