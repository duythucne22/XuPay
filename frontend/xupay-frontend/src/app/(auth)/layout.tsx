/* ============================================
   AUTH LAYOUT - Public authentication pages layout
   Route Group: (auth)
   ============================================ */

import type { ReactNode } from 'react'
import { AuthHeader } from '@/components/layout/AuthHeader'
import { AuthMarketingPanel } from '@/components/layout/AuthMarketingPanel'
import { AuthFooter } from '@/components/layout/AuthFooter'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      {/* Header */}
      <AuthHeader />

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side - Form Area */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full">{children}</div>
        </div>

        {/* Right Side - Marketing Panel (Desktop Only) */}
        <AuthMarketingPanel />
      </main>

      {/* Footer */}
      <AuthFooter />
    </div>
  )
}
