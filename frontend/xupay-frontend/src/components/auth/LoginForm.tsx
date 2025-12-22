'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { useLogin } from '@/hooks/api/useAuth.new'
import type { LoginRequest } from '@/lib/userServiceClient'

interface LoginFormProps {
  onSuccess?: (user: any) => void
  redirectTo?: string
}

// Mock credentials for easy testing
const MOCK_CREDENTIALS = {
  email: 'admin@xupay.com',
  password: 'Admin@123'
}

export function LoginForm({ onSuccess, redirectTo = '/dashboard' }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [localError, setLocalError] = useState<string | null>(null)
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null)

  const mutation = useLogin()

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = regex.test(value)
    setIsEmailValid(isValid)
    return isValid
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
    // Reset error
    setLocalError(null)

    // Email required
    if (!email.trim()) {
      setLocalError('Email is required')
      return false
    }

    // Email format
    if (!isEmailValid) {
      setLocalError('Please enter a valid email address')
      return false
    }

    // Password required
    if (!password) {
      setLocalError('Password is required')
      return false
    }

    return true
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const payload: LoginRequest = {
      email: email.trim(),
      password,
    }

    mutation.mutate(payload)
  }

  // Handle mutation success
  if (mutation.isSuccess) {
    if (onSuccess) {
      onSuccess(mutation.data?.user)
    }
    // Redirect after a brief moment
    setTimeout(() => {
      router.push(redirectTo)
    }, 100)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mock Credentials Helper */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 
          border border-emerald-200 dark:border-emerald-800 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-1">
              Quick Test Login
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-2">
              Use these credentials for testing:
            </p>
            <div className="flex flex-col gap-1 text-xs font-mono text-emerald-800 dark:text-emerald-200 mb-3">
              <div>Email: {MOCK_CREDENTIALS.email}</div>
              <div>Password: {MOCK_CREDENTIALS.password}</div>
            </div>
            <button
              type="button"
              onClick={fillMockCredentials}
              className="text-xs font-medium px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 
                text-white transition-colors"
            >
              Auto-fill credentials
            </button>
          </div>
        </div>
      </motion.div>

      {/* Error Alert */}
      {(localError || mutation.isError) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
            rounded-lg flex gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-200">
            {localError || (mutation.error as any)?.message || 'Login failed. Please try again.'}
          </p>
        </motion.div>
      )}

      {/* Success Alert */}
      {mutation.isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 
            rounded-lg flex gap-3"
        >
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800 dark:text-green-200">
            Login successful! Redirecting...
          </p>
        </motion.div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="you@example.com"
            disabled={mutation.isPending}
            data-testid="email-input"
            className={`
              w-full pl-10 pr-4 py-3 rounded-lg
              bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm
              border-2 transition-all duration-200
              text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-emerald-500/20
              ${isEmailValid === false 
                ? 'border-red-300 dark:border-red-700 focus:border-red-500' 
                : isEmailValid === true
                ? 'border-green-300 dark:border-green-700 focus:border-green-500'
                : 'border-gray-200 dark:border-slate-700 focus:border-emerald-500'
              }
            `}
          />
          {isEmailValid === true && (
            <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
          )}
          {isEmailValid === false && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
          )}
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={mutation.isPending}
            data-testid="password-input"
            className="
              w-full pl-10 pr-12 py-3 rounded-lg
              bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm
              border-2 border-gray-200 dark:border-slate-700
              text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
              transition-all duration-200
            "
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 
              dark:hover:text-gray-300 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-emerald-600 bg-white dark:bg-slate-800 border-gray-300 
              dark:border-slate-600 rounded focus:ring-2 focus:ring-emerald-500/20"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Remember me
          </label>
        </div>
        <a href="#" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 
          hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={mutation.isPending || mutation.isSuccess}
        whileHover={{ scale: mutation.isPending ? 1 : 1.02 }}
        whileTap={{ scale: mutation.isPending ? 1 : 0.98 }}
        data-testid="submit-button"
        className="
          w-full flex items-center justify-center py-3 px-4 rounded-lg font-semibold text-white
          bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700
          disabled:from-emerald-400 disabled:to-green-400 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-emerald-500/40
          transition-all duration-200 shadow-lg shadow-emerald-500/30
        "
      >
        {mutation.isPending && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {mutation.isPending ? 'Signing in...' : mutation.isSuccess ? 'Success!' : 'Sign In'}
      </motion.button>
    </form>
  )
}

export default LoginForm