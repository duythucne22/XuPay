'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { mediaItems, partners } from './HomeData'

export default function SocialProof() {
  return (
    <>
      {/* Media Coverage */}
      <section className="py-20 px-4 relative overflow-hidden z-10">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
              Recent Media Coverage
            </h2>
            <button className="px-6 py-3 rounded-full font-medium bg-[rgba(var(--color-primary-rgb),0.06)] border border-[rgba(var(--color-primary-rgb),0.12)] text-[var(--color-primary)] hover:bg-[rgba(var(--color-primary-rgb),0.1)] transition-all">
              View All Articles
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {mediaItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-black/40 backdrop-blur-sm border border-[rgba(var(--color-primary-rgb),0.12)] overflow-hidden relative group"
              >
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="bg-[rgba(var(--color-primary-rgb),0.08)] p-2 rounded-full mr-3"><div className="bg-[var(--color-primary)] w-2 h-2 rounded-full"></div></div>
                    <span className="text-sm text-gray-400">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[var(--color-primary)] transition-colors">{item.title}</h3>
                  <a href={item.link} className="inline-flex items-center text-[var(--color-primary)] font-medium hover:gap-2 transition-all">
                    Read Full Article <ArrowRight size={16} className="ml-1" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 px-4 bg-gradient-to-b from-[var(--color-bg-secondary)] to-[var(--color-bg-primary)] relative overflow-hidden z-10">
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
            Trusted by Industry Leaders
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8 mt-16">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center justify-center p-4 group"
              >
                 <div className="relative bg-[rgba(var(--color-primary-rgb),0.04)] backdrop-blur-sm border border-[rgba(var(--color-primary-rgb),0.12)] rounded-2xl p-4 flex items-center justify-center w-24 h-24 group-hover:border-[var(--color-primary)]/50 transition-all">
                    <img src={partner.image} alt={partner.name} className="max-w-[60px] max-h-[60px] object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <span className="mt-4 text-sm text-gray-300 font-medium">{partner.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}