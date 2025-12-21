'use client'

import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { KPICardProps } from '@/types'

export function KPICard({
  title,
  value,
  change,
  icon: Icon,
  description,
  isLoading = false,
}: KPICardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-24 mb-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-20" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="group hover:shadow-lg transition-shadow duration-200 h-full">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {Icon && (
            <Icon className="w-5 h-5 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
          )}
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="space-y-1"
          >
            <div className="text-2xl font-bold">
              {value}
            </div>

            {change && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className={`text-xs flex items-center gap-1 ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}
              >
                {change.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>
                  {change.isPositive ? '+' : ''}{change.value}%
                </span>
              </motion.div>
            )}

            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
