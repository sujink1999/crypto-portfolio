"use client";

import { ReactNode } from "react";

// Trivial Text wrapper (src/Components/shared/Text.tsx).
export const Text = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => <p className={className}>{children}</p>;

// The 8-dot spinner (src/Components/shared/Loaders/Loaders.tsx). Dots inherit
// currentColor so the spinner tints to the step's loaderColor.
export const TransactionLoader = ({ color }: { color?: string }) => (
  <div className="custom-loader" style={{ color }} />
);

const styleVariants = {
  disabled:
    "bg-dropdown/50 text-tertiary border-dropdown rounded-md border-solid border-[1px] cursor-not-allowed",
  normal:
    " bg-purple rounded-md border-solid border-[1px] border-purple hover:bg-purple/70 transition-all",
  secondary:
    " bg-dropdown rounded-md border-solid border-[1px] border-dropdown hover:bg-dropdown/70 transition-all",
} as const;

// Shared Button (src/Components/shared/Button.tsx), simplified: no Tippy dep.
export const Button = ({
  children,
  onClick,
  disabled = false,
  className = "",
  variant = "normal",
  title,
}: {
  children: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
  variant?: "normal" | "secondary" | "disabled";
  title?: string;
}) => (
  <button
    disabled={disabled}
    title={title}
    className={`${disabled ? styleVariants.disabled : styleVariants[variant]} ${className}`}
    onClick={(e) => !disabled && onClick?.(e)}
  >
    {children}
  </button>
);

// Collateral switch (src/Components/shared/Switch/Switch.tsx), simplified.
export const Switch = ({
  isChecked,
  onClick,
  isDisabled,
}: {
  symbol?: string;
  isChecked: boolean;
  onClick: (e: React.MouseEvent) => void;
  isDisabled?: boolean;
}) => (
  <button
    className="switch"
    onClick={
      isDisabled
        ? (e) => {
            e.stopPropagation();
          }
        : onClick
    }
  >
    <input type="checkbox" checked={isChecked} readOnly />
    <span
      className={`slider round ${
        isDisabled ? "slider-disabled cursor-not-allowed" : ""
      }`}
    />
  </button>
);
