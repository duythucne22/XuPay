'use client'

import { Lock } from 'lucide-react'

export function AuthFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full py-6 px-6 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {year} XUPAY. All rights reserved.
          </p>
        </div>

        <div className="flex items-start justify-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
          <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Secure login.</span> Your credentials are encrypted with
            bank-grade security. We never share your data with third parties.
          </p>
        </div>
      </div>
    </footer>
  )
}
