'use client'

import { motion } from 'framer-motion'
import { Sparkles, Wallet, ArrowRight } from 'lucide-react'
import { coreComponents } from './HomeData'
import FeatureCard from './FeatureCard'

interface FeaturesGridProps {
  companyName: string
}

export default function FeaturesGrid({ companyName }: FeaturesGridProps) {
  return (
    <>
      {/* Introducing Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-[#0a0a15] relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `repeating-linear-gradient(0deg, #22c55e 0px, #22c55e 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #22c55e 0px, #22c55e 1px, transparent 1px, transparent 40px)`
        }} />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-8">
            <Sparkles className="text-emerald-400" size={32} />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
            Introducing {companyName}
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300 leading-relaxed">
            {companyName} is a next-generation payment management platform designed for organizations operating across both fiat and digital assets.
          </p>
        </motion.div>
      </section>

      {/* Core Components Grid */}
      <section className="py-20 px-4 relative overflow-hidden z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
            Foundational Pillars
          </h2>
          <div className="flex flex-wrap items-stretch justify-between gap-8 mt-16">
            {coreComponents.map((component, index) => (
              <FeatureCard
                key={index}
                title={component.title}
                description={component.description}
                icon={component.icon}
                className="min-h-[140px] w-full sm:w-[48%] lg:w-[23%]"
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Wealth Management */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#0a0a15] to-black relative overflow-hidden z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <div className="rounded-3xl p-10 border border-emerald-500/10 bg-black/40 backdrop-blur-xl text-center">
             <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <Wallet className="text-emerald-400" size={28} />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent mb-8">
                Wealth Management
              </h3>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                {companyName} empowers users to earn, diversify, and protect their assets through institutional grade yield infrastructure.
              </p>
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full font-semibold bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-600 hover:to-cyan-500 transition-all text-lg shadow-lg shadow-emerald-500/30 flex items-center gap-3 text-gray-900"
                >
                  Learn More <ArrowRight size={20} />
                </motion.button>
              </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}