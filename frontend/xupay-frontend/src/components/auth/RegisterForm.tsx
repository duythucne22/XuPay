'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRegister } from '@/hooks/api/useAuth.new'
import type { RegisterRequest } from '@/lib/userServiceClient'

interface RegisterFormProps {
  onSuccess?: (user: any) => void
  redirectTo?: string
}

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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const mutation = useRegister()

  // Real-time validation helpers
  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  function validatePassword(pwd: string): boolean {
    // At least 8 chars, 1 uppercase, 1 number, 1 special char
    return pwd.length >= 8 && /[A-Z]/.test(pwd) && /\d/.test(pwd) && /[!@#$%^&*]/.test(pwd)
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
    const errors: Record<string, string> = {}
    setLocalError(null)

    // Email
    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Password
    if (!password) {
      errors.password = 'Password is required'
    } else if (!validatePassword(password)) {
      errors.password = 'Password must be at least 8 characters with uppercase, number, and special character'
    }

    // Confirm password
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    // First name
    if (!firstName.trim()) {
      errors.firstName = 'First name is required'
    }

    // Last name
    if (!lastName.trim()) {
      errors.lastName = 'Last name is required'
    }

    // Phone (optional but validate format if provided)
    if (phone && !/^\+?[\d\s\-()]{10,}$/.test(phone)) {
      errors.phone = 'Please enter a valid phone number'
    }

    // Terms
    if (!termsAgreed) {
      errors.terms = 'You must agree to the terms and conditions'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const payload: RegisterRequest = {
      email: email.trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || undefined,
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

  const passwordStrength = getPasswordStrength(password)

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={mutation.isPending}
          data-testid="email-input"
          className={`
            w-full px-4 py-2.5 rounded-lg
            border bg-white text-gray-900 placeholder-gray-500
            disabled:bg-gray-100 disabled:text-gray-500
            focus:outline-none focus:ring-1 focus:ring-offset-0
            transition-colors duration-200
            ${
              validationErrors.email
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
          `}
        />
        {validationErrors.email && (
          <p className="text-xs text-red-600">{validationErrors.email}</p>
        )}
      </div>

      {/* First Name */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            disabled={mutation.isPending}
            data-testid="firstName-input"
            className={`
              w-full px-4 py-2.5 rounded-lg
              border bg-white text-gray-900 placeholder-gray-500
              disabled:bg-gray-100 disabled:text-gray-500
              focus:outline-none focus:ring-1 focus:ring-offset-0
              transition-colors duration-200
              ${
                validationErrors.firstName
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
            `}
          />
          {validationErrors.firstName && (
            <p className="text-xs text-red-600">{validationErrors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            disabled={mutation.isPending}
            data-testid="lastName-input"
            className={`
              w-full px-4 py-2.5 rounded-lg
              border bg-white text-gray-900 placeholder-gray-500
              disabled:bg-gray-100 disabled:text-gray-500
              focus:outline-none focus:ring-1 focus:ring-offset-0
              transition-colors duration-200
              ${
                validationErrors.lastName
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
            `}
          />
          {validationErrors.lastName && (
            <p className="text-xs text-red-600">{validationErrors.lastName}</p>
          )}
        </div>
      </div>

      {/* Phone (optional) */}
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number (optional)
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+84 9 1234 5678"
          disabled={mutation.isPending}
          data-testid="phone-input"
          className={`
            w-full px-4 py-2.5 rounded-lg
            border bg-white text-gray-900 placeholder-gray-500
            disabled:bg-gray-100 disabled:text-gray-500
            focus:outline-none focus:ring-1 focus:ring-offset-0
            transition-colors duration-200
            ${
              validationErrors.phone
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
          `}
        />
        {validationErrors.phone && (
          <p className="text-xs text-red-600">{validationErrors.phone}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={mutation.isPending}
          data-testid="password-input"
          className={`
            w-full px-4 py-2.5 rounded-lg
            border bg-white text-gray-900 placeholder-gray-500
            disabled:bg-gray-100 disabled:text-gray-500
            focus:outline-none focus:ring-1 focus:ring-offset-0
            transition-colors duration-200
            ${
              validationErrors.password
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
          `}
        />
        {validationErrors.password && (
          <p className="text-xs text-red-600">{validationErrors.password}</p>
        )}

        {/* Password Strength Meter */}
        {password && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    i <= passwordStrength.score ? passwordStrength.color : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p
              className={`text-xs font-medium ${
                passwordStrength.color === 'bg-green-500'
                  ? 'text-green-600'
                  : passwordStrength.color === 'bg-blue-500'
                  ? 'text-blue-600'
                  : passwordStrength.color === 'bg-yellow-500'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
            >
              Strength: {passwordStrength.label}
            </p>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <div className="flex items-center">
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            disabled={mutation.isPending}
            data-testid="confirmPassword-input"
            className={`
              w-full px-4 py-2.5 rounded-lg
              border bg-white text-gray-900 placeholder-gray-500
              disabled:bg-gray-100 disabled:text-gray-500
              focus:outline-none focus:ring-1 focus:ring-offset-0
              transition-colors duration-200
              ${
                validationErrors.confirmPassword
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
            `}
          />
          {confirmPassword && password === confirmPassword && (
            <div className="ml-2 text-green-600 text-lg">✓</div>
          )}
        </div>
        {validationErrors.confirmPassword && (
          <p className="text-xs text-red-600">{validationErrors.confirmPassword}</p>
        )}
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start gap-3">
        <input
          id="terms"
          type="checkbox"
          checked={termsAgreed}
          onChange={(e) => setTermsAgreed(e.target.checked)}
          disabled={mutation.isPending}
          data-testid="terms-checkbox"
          className="
            w-4 h-4 mt-1 rounded border-gray-300
            text-blue-600 focus:ring-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
          "
        />
        <label htmlFor="terms" className="text-sm text-gray-700">
          I agree to the{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            Privacy Policy
          </a>
        </label>
      </div>
      {validationErrors.terms && (
        <p className="text-xs text-red-600 ml-7">{validationErrors.terms}</p>
      )}

      {/* Error Message */}
      {(localError || mutation.isError) && (
        <div
          data-testid="error-message"
          className="
            p-3 rounded-lg bg-red-50 border border-red-200
            text-red-700 text-sm
          "
        >
          {localError || (mutation.error as any)?.message || 'Registration failed. Please try again.'}
        </div>
      )}

      {/* Success Message */}
      {mutation.isSuccess && (
        <div
          data-testid="success-message"
          className="
            p-3 rounded-lg bg-green-50 border border-green-200
            text-green-700 text-sm
          "
        >
          ✓ Account created successfully! Redirecting...
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={mutation.isPending || mutation.isSuccess}
        data-testid="submit-button"
        className="
          w-full px-4 py-2.5 rounded-lg
          bg-blue-600 text-white font-medium
          hover:bg-blue-700 disabled:bg-blue-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:cursor-not-allowed
          transition-colors duration-200
          flex items-center justify-center gap-2
        "
      >
        {mutation.isPending && (
          <svg
            className="animate-spin h-4 w-4"
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
        {mutation.isPending ? 'Creating account...' : 'Create Account'}
      </button>

      {/* Footer */}
      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign in
        </a>
      </div>
    </form>
  )
}

export default RegisterForm
