'use client'

import React, { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Size = 'sm' | 'md' | 'lg' | 'xl' | 'full'
type Padding = 'none' | 'sm' | 'md' | 'lg'

interface ContainerProps {
  children: ReactNode
  className?: string
  /**
   * Size maps to a max-width token per spec.md
   * Defaults to 'lg' (container-max-width: 1280px / max-w-7xl)
   * - sm => max-w-md (448px) — for centered forms
   * - md => max-w-2xl (672px) — for narrow content
   * - lg => max-w-7xl (1280px) — spec default for dashboard/page content
   * - xl => max-w-8xl (1408px) — for hero sections
   * - full => max-w-full (100%) — no constraint
   */
  size?: Size
  /**
   * Padding control per spec spacing scale
   * Defaults to 'md' (px-6 py-8)
   * - none => no padding
   * - sm => px-4 py-4
   * - md => px-6 py-8 (default, matches spec)
   * - lg => px-8 py-12
   */
  padding?: Padding
  /**
   * Apply max-width wrapper (default: true)
   * When false, container stretches to 100%
   */
  maxWidth?: boolean
}

const SIZE_MAP: Record<Size, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-7xl',
  xl: 'max-w-8xl',
  full: 'max-w-full',
}

const PADDING_MAP: Record<Padding, string> = {
  none: 'p-0',
  sm: 'px-4 py-4',
  md: 'px-6 py-8',
  lg: 'px-8 py-12',
}

export function Container({
  children,
  className,
  size = 'lg',
  padding = 'md',
  maxWidth = true,
}: ContainerProps) {
  // Apply max-width from size map (if enabled) + center + padding
  // Per spec: --container-padding-x: 1.5rem, --container-padding-y: 2rem
  const sizeCls = maxWidth ? (SIZE_MAP[size] ?? SIZE_MAP.lg) : SIZE_MAP.full
  const paddingCls = PADDING_MAP[padding] ?? PADDING_MAP.md

  // Minimal CSS variable usage for default (md) padding and lg container max-width
  const style: React.CSSProperties = {}
  if (maxWidth && size === 'lg') {
    style.maxWidth = 'var(--container-max-width)'
  }
  if (padding === 'md') {
    style.padding = 'var(--container-padding-y) var(--container-padding-x)'
  }

  return (
    <div
      className={cn('mx-auto', sizeCls, paddingCls, className)}
      style={style}
    >
      {children}
    </div>
  )
}