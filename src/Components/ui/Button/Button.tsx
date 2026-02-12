import React, { type ReactNode } from "react";

type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "primary" | "outline" | "circle";

interface ButtonProps {
  children?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-base px-4 py-2",
  lg: "text-lg px-5 py-2.5",
};

const circleSizeClasses: Record<ButtonSize, string> = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "text-gray-700 border border-gray-400 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]",
  outline:
    "text-gray-700 ring-1 ring-gray-400 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]",
  circle:
    "border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white rounded-full",
};

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-lg transition focus:outline-none focus:ring";

  const finalSizeClasses =
    variant === "circle"
      ? circleSizeClasses[size]
      : sizeClasses[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${finalSizeClasses}
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
        ${className}
      `}
    >
      {variant === "circle" ? (
        children
      ) : (
        <>
          {startIcon && <span className="flex items-center">{startIcon}</span>}
          {children}
          {endIcon && <span className="flex items-center">{endIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
