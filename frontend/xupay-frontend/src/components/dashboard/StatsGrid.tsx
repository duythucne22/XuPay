'use client'

import { motion } from 'framer-motion'
import { StaggerContainer, itemVariants } from '@/components/animations'
import { StatCard } from '@/components/dashboard/StatCard'
import Grid from '@/components/layout/Grid'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from 'lucide-react'

export function StatsGrid() {
  const stats = [
    {
      label: 'Total Balance',
      value: '$2,545.44',
      change: '+12.5%',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'blue',
      trend: 'up',
    },
    {
      label: 'Total Income',
      value: '$1,423.00',
      change: '+8.3%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'green',
      trend: 'up',
    },
    {
      label: 'Total Expenses',
      value: '$898.00',
      change: '+2.1%',
      icon: <TrendingDown className="w-6 h-6" />,
      color: 'red',
      trend: 'down',
    },
    {
      label: 'Total Savings',
      value: '$525.44',
      change: '+25.0%',
      icon: <PiggyBank className="w-6 h-6" />,
      color: 'purple',
      trend: 'up',
    },

  ]

  return (
    <StaggerContainer className="w-full">
      <Grid cols={1} md={2} lg={4} gap={6}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
          >
            <StatCard
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color as 'blue' | 'green' | 'purple' | 'red' | 'amber'}
            />
          </motion.div>
        ))}
      </Grid>
    </StaggerContainer>
  )
}
