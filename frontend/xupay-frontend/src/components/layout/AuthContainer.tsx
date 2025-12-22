'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Lock, Sparkles } from 'lucide-react'

interface AuthContainerProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export function AuthContainer({ children, title, subtitle }: AuthContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      {/* Header Section */}
      {(title || subtitle) && (
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-green-600 
              rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30"
          >
            <Lock className="w-7 h-7 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>
      )}

      {/* Content with Glassmorphism */}
      <div className="relative">
        {/* Glassmorphism container */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl 
          shadow-2xl border border-gray-200/50 dark:border-slate-700/50 p-8
          relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent 
            to-green-500/5 pointer-events-none" />
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>

        {/* Security badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-emerald-50/80 dark:bg-emerald-900/20 backdrop-blur-sm 
            border border-emerald-200/50 dark:border-emerald-800/50 rounded-xl flex gap-3"
        >
          <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            <span className="font-semibold">Bank-grade security.</span> Your data is encrypted end-to-end.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
