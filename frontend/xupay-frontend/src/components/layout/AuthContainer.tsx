'use client'

import { ReactNode } from 'react'

interface AuthContainerProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export function AuthContainer({ children, title, subtitle }: AuthContainerProps) {
  return (
    <div className="w-full">
      {/* Title and Subtitle */}
      {(title || subtitle) && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
