'use client'

import { motion } from 'framer-motion'
import { 
  Card as ShadcnCard, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  isHoverable?: boolean
}

export function Card({
  children,
  isHoverable = false,
  className,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={isHoverable ? { y: -4 } : undefined}
      transition={{ duration: 0.2 }}
    >
      <ShadcnCard
        className={cn(
          'transition-shadow duration-200',
          isHoverable && 'hover:shadow-md cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </ShadcnCard>
    </motion.div>
  )
}

// Re-export sub-components for convenience
export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
