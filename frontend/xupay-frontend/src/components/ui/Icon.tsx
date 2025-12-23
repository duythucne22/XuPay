'use client'

import React from 'react'
import { cn } from '@/lib/cn'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon'

const SIZE_MAP: Record<Size, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  icon: 'h-10 w-10',
}

interface IconProps {
  as: React.ComponentType<React.SVGProps<SVGSVGElement>>
  size?: Size
  className?: string
  ariaLabel?: string
}

export function Icon({ as: As, size = 'md', className = '', ariaLabel }: IconProps) {
  return <As className={cn(SIZE_MAP[size], className)} aria-label={ariaLabel} />
}
