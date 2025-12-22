import React from 'react'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    // Max-width restricted to 1600px for large dashboard views
    // Padding ensures content never touches the edge on mobile
    <div className={`max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}