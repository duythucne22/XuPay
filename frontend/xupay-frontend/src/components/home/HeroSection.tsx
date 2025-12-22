'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { heroTexts } from './HomeData'
import useTypewriter from '@/hooks/useTypewriter'

interface HeroSectionProps {
  companyName: string
}

export default function HeroSection({ companyName }: HeroSectionProps) {
  const router = useRouter()
  const typedState = useTypewriter(heroTexts, { typeSpeed: 90, deleteSpeed: 45, pause: 1400, loop: true })
  const typed = typedState.text
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    function startAutoplay() {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        setCurrentIndex(i => (i + 1) % heroTexts.length)
      }, 3000)
    }
    
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') setCurrentIndex(i => (i + 1) % heroTexts.length)
      if (e.key === 'ArrowLeft') setCurrentIndex(i => (i - 1 + heroTexts.length) % heroTexts.length)
    }
    
    startAutoplay()
    window.addEventListener('keydown', onKey)
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        setCurrentIndex(i => (i + 1) % heroTexts.length)
      }, 4000)
    }
  }

  return (
    <section className="pt-32 pb-16 px-4 relative z-10">
      <div className="max-w-6xl mx-auto flex flex-row items-stretch gap-6">
        {/* Left Section */}
        <div className="flex-[0_0_40%] flex flex-col justify-center p-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-bold leading-tight mb-4 text-gray-100"
          >
            Secure your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">{companyName}</span> — <span className="inline-block text-emerald-300" data-testid="typed-hero">{typed}</span>
            <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{typed}</span>
            <span className="inline-block w-1 h-8 ml-2 bg-emerald-400 rounded animate-pulse" aria-hidden />
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-300 mb-6 max-w-xl"
          >
            {companyName} empowers users, institutions, and developers to build the next generation of financial tools—secure, compliant, and permissionless.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-4 flex-wrap"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/register')}
              className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-600 hover:to-cyan-500 transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2 text-gray-900"
            >
              Get Started <ArrowRight size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-full border border-emerald-500/30 text-emerald-400 bg-transparent hover:bg-emerald-500/10 transition-all"
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>

        {/* Right Section – Carousel */}
        <div
          className="relative flex-1 flex items-center justify-center overflow-hidden min-h-[420px] bg-black/20 backdrop-blur-xl border border-emerald-500/10 rounded-2xl shadow-2xl"
          onMouseEnter={() => { if (intervalRef.current) clearInterval(intervalRef.current) }}
          onMouseLeave={() => {
            if (intervalRef.current) clearInterval(intervalRef.current)
            intervalRef.current = setInterval(() => {
              setCurrentIndex(i => (i + 1) % heroTexts.length)
            }, 4000)
          }}
        >
            {/* Stats Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-4 z-30 pointer-events-none">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-right bg-black/30 backdrop-blur-sm p-3 rounded-xl border border-emerald-500/20">
                <div className="font-bold text-xl text-emerald-400">$2.5B</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Assets Secured</div>
              </motion.div>
              {/* Add other stats here if needed, keeping it minimal for brevity */}
            </div>

            {/* Slides */}
            <div className="w-full h-full relative flex items-center justify-center">
              {heroTexts.map((text, idx) => {
                const isActive = idx === currentIndex
                const isPrev = idx < currentIndex
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ 
                      opacity: isActive ? 1 : (isPrev ? 0.4 : 0),
                      x: isActive ? 0 : (isPrev ? -100 : 100),
                      zIndex: isActive ? 30 : (isPrev ? 20 : 10)
                    }}
                    transition={{ duration: isActive ? 0.8 : 0.5, ease: "easeInOut" }}
                    className={`absolute inset-0 flex items-center justify-center text-center ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
                  >
                    <div className="px-6">
                      <div
                        className="font-extrabold uppercase tracking-wider text-center"
                        style={{
                          fontSize: 'clamp(2.25rem, 6vw, 4.5rem)',
                          background: 'linear-gradient(135deg, #5dc910ff 0%, #9cdc10ff 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          lineHeight: 1
                        }}
                      >
                        {text}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Dots */}
            <div className="absolute bottom-6 inset-x-0 z-40 flex justify-center gap-3">
              {heroTexts.map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => goToSlide(i)}
                  className={`h-2.5 transition-all duration-300 rounded-full ${
                    i === currentIndex 
                      ? 'w-8 bg-gradient-to-r from-emerald-400 to-cyan-300 shadow-lg shadow-emerald-500/50' 
                      : 'w-2.5 bg-gray-500/30 hover:bg-gray-400/50'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
        </div>
      </div>
    </section>
  )
}