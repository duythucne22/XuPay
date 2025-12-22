/* ============================================
   REGISTER PAGE
   Route: /register
   ============================================ */

'use client'

import Link from 'next/link'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { AuthContainer } from '@/components/layout/AuthContainer'

export default function RegisterPage() {
  return (
    <AuthContainer
      title="Create Your Account"
      subtitle="Join thousands of users managing their finances with XuPay"
    >
      <div className="space-y-6">
        <RegisterForm />

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </AuthContainer>
  )
}
