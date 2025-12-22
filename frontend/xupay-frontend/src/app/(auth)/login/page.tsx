/* ============================================
   LOGIN PAGE
   Route: /login
   ============================================ */

'use client'

import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'
import { AuthContainer } from '@/components/layout/AuthContainer'

export default function LoginPage() {
  return (
    <AuthContainer
      title="Welcome Back"
      subtitle="Log in to manage your wallets and payments securely"
    >
      <div className="space-y-6">
        <LoginForm />

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </AuthContainer>
  )
}
