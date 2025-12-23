'use client'

import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

/**
 * AuthLayout - For login and register pages
 * 
 * Structure (Desktop):
 * - Left (50%): Form container, centered
 * - Right (50%): Hero/gradient background
 * 
 * Structure (Mobile):
 * - Full width form
 * - Hero hidden
 * 
 * No sidebar, no topbar
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Form Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:px-6 md:py-0 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Right Side - Hero/Gradient (Desktop Only) */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-emerald-600 to-emerald-800 dark:from-emerald-900 dark:to-emerald-950 items-center justify-center p-8">
        <div className="text-center text-white">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome to XuPay</h2>
          <p className="text-lg text-emerald-100 max-w-sm">
            Secure, fast, and reliable payment solutions for everyone.
          </p>
        </div>
      </div>
    </div>
  )
}
