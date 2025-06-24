import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  agreedToTerms?: boolean;
  className?: string;
  loading?: boolean;
  text: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
  isDisabled?: boolean;
};

const CustomButton = ({
  agreedToTerms,
  className,
  loading,
  text,
  onClick,
  type,
  isDisabled,
}: Props) => {
  return (
    <Button
      className={cn(
        "flex justify-center items-center cursor-pointer self-stretch text-white font-medium py-2 md:py-3 px-4 md:px-6 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0.5 text-sm md:text-sm",
        className
      )}
      disabled={
        agreedToTerms === false || (agreedToTerms == null && isDisabled)
      }
      onClick={onClick}
      type={type}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-3 h-7 w-7 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        text
      )}
    </Button>
  );
};

export default CustomButton;
