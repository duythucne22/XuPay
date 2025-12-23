"use client"

import React from 'react'
import { cn } from '@/lib/cn'

interface GridProps {
  children?: React.ReactNode
  className?: string
  cols?: number
  md?: number
  lg?: number
  gap?: number | string
}

/**
 * Grid primitive — lightweight wrapper around Tailwind grid utilities.
 * Use numeric values for `cols`, `md`, `lg` and a number for `gap` (maps to `gap-{n}`).
 */
export default function Grid({ children, className, cols = 1, md, lg, gap = 6 }: GridProps) {
  const gapCls = typeof gap === 'number' ? `gap-${gap}` : String(gap)
  const base = `grid grid-cols-${cols}`
  const mdCls = md ? `md:grid-cols-${md}` : ''
  const lgCls = lg ? `lg:grid-cols-${lg}` : ''

  return <div className={cn(base, mdCls, lgCls, gapCls, className)}>{children}</div>
}
