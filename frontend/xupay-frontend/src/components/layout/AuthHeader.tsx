'use client'

import Link from 'next/link'
import { Lock } from 'lucide-react'

export function AuthHeader() {
  return (
    <header className="w-full py-4 px-6 border-b border-gray-200 dark:border-slate-700">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md flex items-center justify-center shadow-md">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            XUPAY
          </h1>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6">
          <a
            href="#help"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Help
          </a>
          <a
            href="#privacy"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Privacy
          </a>
          <a
            href="#terms"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Terms
          </a>
        </nav>
      </div>
    </header>
  )
}
