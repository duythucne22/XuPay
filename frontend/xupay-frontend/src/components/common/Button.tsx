'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Button as ShadcnButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  isLoading?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const buttonVariants = {
  hover: {
    y: -2,
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  tap: {
    y: 0,
    scale: 0.98,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
}

export function Button({
  children,
  variant = 'default',
  size = 'default',
  isLoading = false,
  disabled = false,
  className,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <motion.div
      variants={buttonVariants}
      whileHover={!disabled && !isLoading ? 'hover' : undefined}
      whileTap={!disabled && !isLoading ? 'tap' : undefined}
      transition={{ duration: 0.15 }}
      className="inline-block"
    >
      <ShadcnButton
        variant={variant}
        size={size}
        disabled={disabled || isLoading}
        onClick={onClick}
        className={cn(
          'transition-all duration-200 flex items-center justify-center gap-2',
          className
        )}
        {...props}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {children}
      </ShadcnButton>
    </motion.div>
  )
}
