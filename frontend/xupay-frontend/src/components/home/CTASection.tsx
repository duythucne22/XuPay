'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Lock, TrendingUp, Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CTASection({ companyName }: { companyName: string }) {
  const router = useRouter()
  return (
    <section className="py-24 px-4 relative overflow-hidden z-10">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent leading-tight">
          Ready to transform your financial future?
        </h2>
        <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
          Join thousands of innovators building the future of finance with {companyName}'s secure infrastructure
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/register')}
            className="px-10 py-5 rounded-full font-semibold text-lg bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-600 hover:to-cyan-500 transition-all shadow-lg shadow-emerald-500/40 flex items-center justify-center gap-3 text-gray-900"
          >
            Create Free Account <ArrowRight size={24} />
          </motion.button>
        </div>
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-gray-400">
          {[ 
            { icon: <Lock size={20} />, text: "Bank-grade security" },
            { icon: <TrendingUp size={20} />, text: "Institutional liquidity" },
            { icon: <Wallet size={20} />, text: "Zero transaction fees" }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="text-emerald-400">{item.icon}</div>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}