'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { useLogin } from '@/hooks/api/useAuth.new'
import type { LoginRequest } from '@/lib/userServiceClient'

interface LoginFormProps {
  onSuccess?: (user: any) => void
  redirectTo?: string
}

// Demo credentials (giữ nguyên như bản cũ nếu bạn cần)
const MOCK_CREDENTIALS = {
  email: 'admin@xupay.com',
  password: 'Admin@123',
}

export function LoginForm({ onSuccess, redirectTo = '/dashboard' }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null)
  const [rememberMe, setRememberMe] = useState(true)

  const mutation = useLogin()

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const valid = regex.test(value)
    setIsEmailValid(valid)
    return valid
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (value) validateEmail(value)
    else setIsEmailValid(null)
  }

  const fillMockCredentials = () => {
    setEmail(MOCK_CREDENTIALS.email)
    setPassword(MOCK_CREDENTIALS.password)
    setIsEmailValid(true)
  }

  function validate(): boolean {
    setLocalError(null)

    if (!email.trim()) {
      setLocalError('Email is required')
      return false
    }

    if (isEmailValid === false || !validateEmail(email)) {
      setLocalError('Please enter a valid email address')
      return false
    }

    if (!password) {
      setLocalError('Password is required')
      return false
    }

    return true
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const payload: LoginRequest = {
      email: email.trim(),
      password,
    }

    mutation.mutate(payload, {
      onSuccess: data => {
        if (onSuccess) onSuccess(data?.user)
        setTimeout(() => {
          router.push(redirectTo)
        }, 100)
      },
      onError: (err: any) => {
        setLocalError(err?.message || 'Login failed')
      },
    })
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6" data-testid="login-form">
      {/* Logo + heading giống ảnh */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">SmartSave</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-sm text-gray-500">
          Welcome Back, please enter your details
        </p>
      </div>

      {/* Demo account helper (giữ logic cũ) */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs sm:text-sm text-blue-900 flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold mb-1">Demo Account</p>
          <p>📧 {MOCK_CREDENTIALS.email}</p>
          <p>🔐 {MOCK_CREDENTIALS.password}</p>
        </div>
        <button
          type="button"
          onClick={fillMockCredentials}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          Auto‑fill
        </button>
      </div>

      {/* Error alert */}
      {(localError || mutation.isError) && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs sm:text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {localError ||
              (mutation.error as any)?.message ||
              'Login failed'}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              data-testid="email-input"
              type="email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full rounded-lg border px-10 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isEmailValid === false
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-200'
              }`}
              placeholder="name@example.com"
              disabled={mutation.isPending}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              data-testid="password-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-10 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              disabled={mutation.isPending}
            />
          </div>
        </div>

        {/* Remember + forgot */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              data-testid="remember-checkbox"
            />
            <span className="text-gray-600">Remember password</span>
          </label>
          <button
            type="button"
            className="font-medium text-blue-500 hover:text-blue-600"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          data-testid="login-submit"
        >
          {mutation.isPending ? 'Signing in…' : 'Continue'}
        </button>
      </form>

      {/* bottom link dùng ở page.tsx nên không lặp ở đây */}
    </div>
  )
}

export default LoginForm
