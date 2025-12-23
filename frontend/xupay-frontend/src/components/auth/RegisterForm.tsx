'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useRegister } from '@/hooks/api/useAuth.new'
import type { RegisterRequest } from '@/lib/userServiceClient'

interface RegisterFormProps {
  onSuccess?: (user: any) => void
  redirectTo?: string
}

type ValidationErrors = Partial<{
  email: string
  firstName: string
  lastName: string
  phone: string
  password: string
  confirmPassword: string
  terms: string
}>

export function RegisterForm({ onSuccess, redirectTo = '/dashboard' }: RegisterFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const mutation = useRegister()

  // helpers
  function validateEmail(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  function validatePassword(pwd: string) {
    return (
      pwd.length >= 8 &&
      /[A-Z]/.test(pwd) &&
      /\d/.test(pwd) &&
      /[!@#$%^&*]/.test(pwd)
    )
  }

  function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
    if (!pwd) return { score: 0, label: '', color: 'bg-gray-200' }
    let score = 0
    if (pwd.length >= 8) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/\d/.test(pwd)) score++
    if (/[!@#$%^&*]/.test(pwd)) score++
    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' }
    if (score <= 2) return { score: 2, label: 'Fair', color: 'bg-yellow-500' }
    if (score <= 3) return { score: 3, label: 'Good', color: 'bg-blue-500' }
    return { score: 4, label: 'Strong', color: 'bg-green-500' }
  }

  function validate(): boolean {
    const errors: ValidationErrors = {}
    setLocalError(null)

    if (!email.trim()) errors.email = 'Email is required'
    else if (!validateEmail(email)) errors.email = 'Please enter a valid email address'

    if (!firstName.trim()) errors.firstName = 'First name is required'
    if (!lastName.trim()) errors.lastName = 'Last name is required'

    if (phone && !/^\+?[\d\s\-()]{10,}$/.test(phone)) {
      errors.phone = 'Please enter a valid phone number'
    }

    if (!password) errors.password = 'Password is required'
    else if (!validatePassword(password)) {
      errors.password =
        'Password must be at least 8 characters with uppercase, number, and special character'
    }

    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password'
    else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (!termsAgreed) errors.terms = 'You must agree to the terms and conditions'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const payload: RegisterRequest = {
      email: email.trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || undefined,
    }

    mutation.mutate(payload, {
      onSuccess: data => {
        if (onSuccess) onSuccess(data?.user)
        setTimeout(() => {
          router.push(redirectTo)
        }, 100)
      },
      onError: (err: any) => {
        setLocalError(err?.message || 'Registration failed')
      },
    })
  }

  const passwordStrength = getPasswordStrength(password)

  return (
    <div className="w-full max-w-md mx-auto space-y-6" data-testid="register-form">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">SmartSave</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="text-sm text-gray-500">Create an account to get started</p>
      </div>

      {(localError || mutation.isError) && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs sm:text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {localError ||
              (mutation.error as any)?.message ||
              'Registration failed. Please try again.'}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">First Name</label>
            <input
              data-testid="firstName-input"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="John"
              disabled={mutation.isPending}
              className={cn(
                'w-full rounded-lg border px-3 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                validationErrors.firstName ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
              )}
            />
            {validationErrors.firstName && (
              <p className="text-xs text-red-600">{validationErrors.firstName}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Last Name</label>
            <input
              data-testid="lastName-input"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Doe"
              disabled={mutation.isPending}
              className={cn(
                'w-full rounded-lg border px-3 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                validationErrors.lastName ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
              )}
            />
            {validationErrors.lastName && (
              <p className="text-xs text-red-600">{validationErrors.lastName}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              data-testid="email-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={mutation.isPending}
              className={cn(
                'w-full rounded-lg border px-10 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                validationErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
              )}
            />
          </div>
          {validationErrors.email && (
            <p className="text-xs text-red-600">{validationErrors.email}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Phone Number (optional)</label>
          <input
            data-testid="phone-input"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+84 9 1234 5678"
            disabled={mutation.isPending}
            className={cn(
              'w-full rounded-lg border px-3 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              validationErrors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
            )}
          />
          {validationErrors.phone && (
            <p className="text-xs text-red-600">{validationErrors.phone}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              data-testid="password-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder=""
              disabled={mutation.isPending}
              className={cn(
                'w-full rounded-lg border px-10 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                validationErrors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
              )}
            />
          </div>

          {password && (
            <div className="flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className={cn('h-1.5 flex-1 rounded-full', passwordStrength.score >= i ? passwordStrength.color : 'bg-gray-200')}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">Strength: {passwordStrength.label}</span>
            </div>
          )}

          {validationErrors.password && (
            <p className="text-xs text-red-600">{validationErrors.password}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            data-testid="confirmPassword-input"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder=""
            disabled={mutation.isPending}
            className={cn(
              'w-full rounded-lg border px-3 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              validationErrors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
            )}
          />
          {validationErrors.confirmPassword && (
            <p className="text-xs text-red-600">{validationErrors.confirmPassword}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
            <input
              data-testid="terms-checkbox"
              type="checkbox"
              checked={termsAgreed}
              onChange={e => setTermsAgreed(e.target.checked)}
              disabled={mutation.isPending}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <span>
              I agree to the Terms and Conditions and Privacy Policy.
            </span>
          </label>
          {validationErrors.terms && (
            <p className="text-xs text-red-600">{validationErrors.terms}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          data-testid="submit-button"
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {mutation.isPending ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-xs sm:text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="font-medium text-blue-600 hover:text-blue-700">
          Sign in
        </a>
      </p>
    </div>
  )
}

export default RegisterForm
