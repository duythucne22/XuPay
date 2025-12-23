'use client'

import { Lock, CheckCircle, ArrowRight } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'

export function AuthMarketingPanel() {
  const benefits = [
    'Bank-grade encryption for all transactions',
    'Real-time portfolio tracking and analytics',
    '24/7 customer support with instant help',
  ]

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 items-center justify-center p-12">
      <div className="max-w-md text-center">
        {/* Icon Container */}
        <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-lg">
              <Icon as={Lock} size="lg" className="text-blue-600 dark:text-blue-400" />
            </div>
        </div>

        {/* Heading */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Manage all your wallets in one place
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          XUPAY provides a secure, intuitive platform for managing your digital assets. With advanced
          security features and seamless integration, you can focus on growing your wealth.
        </p>

        {/* Benefits List */}
        <ul className="space-y-4 text-left mb-8">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon as={CheckCircle} size="xs" className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-gray-600 dark:text-gray-400">{benefit}</span>
            </li>
          ))}
        </ul>

        {/* CTA Link */}
        <div>
          <a
            href="#security"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            Learn more about our security features
            <Icon as={ArrowRight} size="sm" className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  )
}
