import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-emerald-500 text-black hover:bg-emerald-400",
        secondary: "border-transparent bg-white/10 text-white hover:bg-white/20",
        destructive: "border-transparent bg-red-500/10 text-red-400 hover:bg-red-500/20",
        outline: "text-foreground",
        // The specific transaction statuses you need:
        success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        warning: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
        error: "border-red-500/20 bg-red-500/10 text-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }