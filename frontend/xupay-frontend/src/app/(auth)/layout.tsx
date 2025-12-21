/* ============================================
   AUTH LAYOUT - Public authentication pages layout
   Route Group: (auth)
   ============================================ */

import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-xupay-primary to-xupay-secondary shadow-lg">
          <span className="text-white font-bold text-xl">X</span>
        </div>
        <span className="text-3xl font-bold bg-gradient-to-r from-xupay-primary to-xupay-secondary bg-clip-text text-transparent">
          XuPay
        </span>
      </div>

      {/* Auth Content */}
      <main className="w-full max-w-md">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} XuPay. All rights reserved.</p>
      </footer>
    </div>
  )
}
