import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-xl border transition-shadow duration-250",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200 hover:shadow-md dark:bg-gray-900 dark:border-gray-800",
        hover: "bg-white border-gray-200 hover:shadow-lg hover:border-gray-300 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-gray-700",
        glass: "bg-white/10 backdrop-blur-md border-white/20 hover:shadow-lg hover:bg-white/15 dark:bg-black/20 dark:border-white/10",
        interactive: "bg-white border-gray-200 hover:bg-gray-50 cursor-pointer dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800",
        elevated: "bg-white border-gray-100 shadow-sm hover:shadow-lg dark:bg-gray-900 dark:border-gray-800",
        outlined: "bg-transparent border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600",
        flat: "bg-gray-50 border-transparent dark:bg-gray-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  variant?: "default" | "hover" | "glass" | "interactive" | "elevated" | "outlined" | "flat";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), "p-6", className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card, cardVariants };
export type { CardProps };
