"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const variants = {
  primary:
    "bg-cranberry text-white hover:bg-cranberry-dark shadow-lg shadow-cranberry/25",
  secondary:
    "bg-gold text-black hover:bg-gold-dark shadow-lg shadow-gold/25",
  outline:
    "border-2 border-cranberry text-cranberry hover:bg-cranberry hover:text-white",
  ghost: "text-cranberry hover:bg-cranberry/10",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 17,
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  external,
  className,
  onClick,
  disabled,
  type = "button",
}: ButtonProps) {
  const baseStyles = cn(
    "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-cranberry focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    if (external) {
      return (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseStyles}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={springTransition}
        >
          {children}
        </motion.a>
      );
    }
    return (
      <Link href={href} className={baseStyles}>
        <motion.span
          className="inline-flex items-center gap-2"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={springTransition}
        >
          {children}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      type={type}
      className={baseStyles}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={springTransition}
    >
      {children}
    </motion.button>
  );
}
