'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, Lock, Sparkles, TrendingUp, Wallet, ArrowRight, 
  Twitter, Linkedin, Github, Phone, MapPin, ChevronRight 
} from 'lucide-react'
import { useAuth } from '@/providers'
import { useRouter } from 'next/navigation'

interface HomePageProps {
  companyName?: string
  primaryColor?: string
  accentColor?: string
}

export default function HomePageContent({
  companyName = 'XuPay',
  primaryColor = '#0ab348ff',
  accentColor = '#10ad51ff',
}: HomePageProps) {
  const { user } = useAuth()
  const router = useRouter()

  const heroTexts = [
    "E-Wallet",
    "Smart Payments",
    "Asset Management",
    "Future of possibility",
    "New vision of finance",
    "Fast way to make payments",
    "Secure way to invest in startups",
    "New opportunity for finance"
  ]

  const coreComponents = [
    { title: "Glass", icon: <TrendingUp size={24} />, description: "Provides real-time visibility and analytics for balances, liquidity, and exposures." },
    { title: "Guard", icon: <Lock size={24} />, description: "Enforces security, governance, and approval workflows." },
    { title: "Flow", icon: <Wallet size={24} />, description: "Automates settlements, transfers, and capital movements." },
    { title: "AI", icon: <Sparkles size={24} />, description: "Delivers forecasting, optimization, and anomaly detection." }
  ]

  const partners = [
    { name: "Ledger", image: "https://placehold.co/80x80?text=Ledger&font=montserrat&color=10b981&bg=0f172a" },
    { name: "Math Wallet", image: "https://placehold.co/80x80?text=Math&font=montserrat&color=10b981&bg=0f172a" },
    { name: "Coinbase Wallet", image: "https://placehold.co/80x80?text=Coinbase&font=montserrat&color=10b981&bg=0f172a" },
    { name: "Guarda Wallet", image: "https://placehold.co/80x80?text=Guarda&font=montserrat&color=10b981&bg=0f172a" },
    { name: "TokenPocket", image: "https://placehold.co/80x80?text=Token&font=montserrat&color=10b981&bg=0f172a" },
    { name: "Bitget", image: "https://placehold.co/80x80?text=Bitget&font=montserrat&color=10b981&bg=0f172a" }
  ]

  const mediaItems = [
    {
      title: "XuPay expands Web3 banking vision with next-gen payment platform",
      date: "Dec 21",
      link: "#"
    },
    {
      title: "The Next-Generation Payment Platform for Digital Asset Management",
      date: "Dec 15",
      link: "#"
    },
    {
      title: "Revolutionizing Payment Management with AI-Powered Finance",
      date: "Dec 10",
      link: "#"
    }
  ]

  // carousel state & controls
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simple particle animation using canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
    }> = []

    const numParticles = window.innerWidth < 768 ? 30 : 60

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.8,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.3
      })
    }

    function animate() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x > canvas.width) particle.x = 0
        if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        if (particle.y < 0) particle.y = canvas.height

        ctx.fillStyle = `rgba(34, 197, 94, ${particle.opacity})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw connections
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.15)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    function startAutoplay() {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        setCurrentIndex(i => (i + 1) % heroTexts.length)
      }, 4000)
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
  }, [heroTexts.length])

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
    <div className="min-h-screen font-sans text-gray-200 overflow-x-hidden">
      {/* Particle Background */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e] opacity-90" />
      
      {/* Navigation Header */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-emerald-500/20"
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <Wallet className="text-emerald-400" size={40} />
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
              {companyName}
            </span>
          </div>
          <div className="flex gap-4">
            {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 rounded-full font-medium bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-600 hover:to-cyan-500 transition-all text-base shadow-lg shadow-emerald-500/20"
              >
                Go to Dashboard
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/login')}
                  className="px-6 py-3 rounded-full font-medium border border-emerald-500/30 hover:border-emerald-400/60 transition-all text-base bg-black/20 backdrop-blur-sm hover:bg-black/30"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/register')}
                  className="px-6 py-3 rounded-full font-medium bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-600 hover:to-cyan-500 transition-all text-base shadow-lg shadow-emerald-500/20"
                >
                  Get Started
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch gap-6">
          {/* Left Section */}
          <div className="flex-0 md:flex-[0_0_40%] flex flex-col justify-center p-6 md:p-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold leading-tight mb-4"
            >
              Secure your future.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base md:text-lg text-gray-300 mb-6 max-w-xl"
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
                className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-600 hover:to-cyan-500 transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2"
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

          {/* Right Section – Carousel with Glass Effect */}
          <div
            className="relative flex-1 flex items-center justify-center overflow-hidden min-h-[320px] md:min-h-[420px] bg-black/20 backdrop-blur-xl border border-emerald-500/10 rounded-2xl shadow-2xl"
            onMouseEnter={() => { if (intervalRef.current) clearInterval(intervalRef.current) }}
            onMouseLeave={() => {
              if (intervalRef.current) clearInterval(intervalRef.current)
              intervalRef.current = setInterval(() => {
                setCurrentIndex(i => (i + 1) % heroTexts.length)
              }, 4000)
            }}
          >
            {/* Stats overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-4 z-30">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-right bg-black/30 backdrop-blur-sm p-3 rounded-xl border border-emerald-500/20"
              >
                <div className="font-bold text-xl text-emerald-400">$2.5B</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Assets Secured</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-right bg-black/30 backdrop-blur-sm p-3 rounded-xl border border-emerald-500/20"
              >
                <div className="font-bold text-xl text-emerald-400">50K+</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Active Users</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-right bg-black/30 backdrop-blur-sm p-3 rounded-xl border border-emerald-500/20"
              >
                <div className="font-bold text-xl text-emerald-400">99.9%</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Uptime</div>
              </motion.div>
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
                    transition={{ 
                      duration: isActive ? 0.8 : 0.5,
                      ease: "easeInOut"
                    }}
                    className={`absolute inset-0 flex items-center justify-center text-center ${
                      isActive ? 'pointer-events-auto' : 'pointer-events-none'
                    }`}
                  >
                    <div className="px-6">
                      <div
                        className="font-extrabold uppercase tracking-wider text-center"
                        style={{
                          fontSize: 'clamp(2.25rem, 6vw, 4.5rem)',
                          background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
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
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex gap-3">
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

      {/* Introducing XuPay */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-[#0a0a15] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(0deg, #22c55e 0px, #22c55e 1px, transparent 1px, transparent 40px),
                           repeating-linear-gradient(90deg, #22c55e 0px, #22c55e 1px, transparent 1px, transparent 40px)`
        }} />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-8"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
              <Sparkles className="text-emerald-400" size={32} />
            </div>
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
            Introducing {companyName}
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300 leading-relaxed">
            {companyName} is a next-generation payment management platform designed for organizations operating across both fiat and digital assets. It connects banks, exchanges, and on-chain systems into one unified environment that gives finance teams real-time visibility, automated policy controls, and intelligence-driven decision support.
          </p>
        </motion.div>
      </section>

      {/* Core Components */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black to-[#0f172a] opacity-70" />
        
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
          <p className="text-center text-gray-400 max-w-3xl mx-auto mb-16">
            Our technology stack combines cutting-edge security with intuitive design to deliver unparalleled financial infrastructure
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreComponents.map((component, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="p-6 rounded-2xl bg-black/40 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-4 rounded-2xl mr-4 bg-emerald-500/10 text-emerald-400">
                    {component.icon}
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                    {component.title}
                  </h3>
                </div>
                <p className="text-gray-300 leading-relaxed group-hover:text-emerald-300 transition-colors">
                  {component.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Wealth Management */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#0a0a15] to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `repeating-linear-gradient(0deg, #22c55e 0px, #22c55e 1px, transparent 1px, transparent 40px),
                           repeating-linear-gradient(90deg, #22c55e 0px, #22c55e 1px, transparent 1px, transparent 40px)`
        }} />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <div className="rounded-3xl p-10 border border-emerald-500/10 bg-black/40 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <Wallet className="text-emerald-400" size={28} />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                Wealth Management
              </h3>
            </motion.div>
            
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              {companyName} empowers users to earn, diversify, and protect their assets through institutional grade yield infrastructure.
            </p>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              From Bitcoin yield strategies to custody solutions, {companyName} democratizes financial tools once reserved for institutions, unlocking new opportunities for individuals worldwide.
            </p>
            
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full font-semibold bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-600 hover:to-cyan-500 transition-all text-lg shadow-lg shadow-emerald-500/30 flex items-center gap-3"
              >
                Learn More
                <ArrowRight size={20} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Recent Media Coverage */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black to-[#0f172a] opacity-70" />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto relative z-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent"
            >
              Recent Media Coverage
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full font-medium bg-gradient-to-r from-emerald-500/10 to-cyan-400/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all"
              >
                View All Articles
              </motion.button>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mediaItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-black/40 backdrop-blur-sm border border-emerald-500/20 overflow-hidden relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="bg-emerald-500/10 p-2 rounded-full mr-3">
                      <div className="bg-emerald-500 w-2 h-2 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-400">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <a href={item.link} className="inline-flex items-center text-emerald-400 font-medium hover:gap-2 transition-all">
                    Read Full Article
                    <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Partners Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#0a0a15] to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `repeating-linear-gradient(0deg, #22c55e 0px, #22c55e 1px, transparent 1px, transparent 40px),
                           repeating-linear-gradient(90deg, #22c55e 0px, #22c55e 1px, transparent 1px, transparent 40px)`
        }} />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto relative z-10"
        >
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
            Trusted by Industry Leaders
          </h2>
          <p className="text-center text-gray-400 max-w-3xl mx-auto mb-16">
            We partner with the world's most innovative financial institutions and blockchain platforms
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center justify-center p-4"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-2xl blur-sm opacity-50 group-hover:opacity-70 transition-opacity" />
                  <div className="relative bg-black/40 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-center w-24 h-24">
                    <img 
                      src={partner.image} 
                      alt={partner.name} 
                      className="max-w-[60px] max-h-[60px] object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
                <span className="mt-4 text-sm text-gray-300 font-medium">{partner.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black to-[#0a0a2a] opacity-90" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(0deg, #22c55e 0px, #22c55e 1px, transparent 1px, transparent 40px),
                           repeating-linear-gradient(90deg, #22c55e 0px, #22c55e 1px, transparent 1px, transparent 40px)`
        }} />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-8"
          >
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto border border-emerald-500/30">
              <div className="text-emerald-400 text-4xl">✦</div>
            </div>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent leading-tight">
            Ready to transform your financial future?
          </h2>
          <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Join thousands of innovators building the future of finance with {companyName}'s secure infrastructure
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/register')}
              className="px-10 py-5 rounded-full font-semibold text-lg bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-600 hover:to-cyan-500 transition-all shadow-lg shadow-emerald-500/40 flex items-center justify-center gap-3"
            >
              Create Free Account
              <ArrowRight size={24} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 rounded-full font-semibold text-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-all backdrop-blur-sm"
            >
              Request Demo
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
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-emerald-500/10 bg-black/90 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `repeating-linear-gradient(0deg, #22c55e 0px, #22c55e 1px, transparent 1px, transparent 40px),
                           repeating-linear-gradient(90deg, #22c55e 0px, #22c55e 1px, transparent 1px, transparent 40px)`
        }} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-xl">
                  <Wallet className="text-black" size={36} />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                  {companyName}
                </span>
              </div>
              <p className="mb-6 max-w-md text-gray-400 leading-relaxed">
                Revolutionizing digital asset payments with cutting-edge security, lightning-fast transactions, and seamless integration.
              </p>
              <div className="flex space-x-5">
                {[Twitter, Linkedin, Github].map((Icon, index) => (
                  <motion.a 
                    key={index}
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href="#" 
                    className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                    aria-label={`Follow us on ${Icon.name}`}
                  >
                    <Icon size={24} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Platform section */}
            <div>
              <h4 className="font-bold text-xl mb-6 text-white flex items-center gap-2">
                Platform
                <ChevronRight className="text-emerald-400/50" size={20} />
              </h4>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'Security', 'API Docs', 'Integrations', 'Roadmap'].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    className="group"
                  >
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-emerald-400 transition-all flex items-center gap-2 py-1"
                    >
                      <ChevronRight className="text-emerald-400/0 group-hover:text-emerald-400/50 transition-colors" size={16} />
                      <span className="group-hover:ml-1 transition-all">{item}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Company section */}
            <div>
              <h4 className="font-bold text-xl mb-6 text-white flex items-center gap-2">
                Company
                <ChevronRight className="text-emerald-400/50" size={20} />
              </h4>
              <ul className="space-y-3">
                {['About Us', 'Blog', 'Careers', 'Partners', 'Press', 'Contact'].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    className="group"
                  >
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-emerald-400 transition-all flex items-center gap-2 py-1"
                    >
                      <ChevronRight className="text-emerald-400/0 group-hover:text-emerald-400/50 transition-colors" size={16} />
                      <span className="group-hover:ml-1 transition-all">{item}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact section */}
            <div>
              <h4 className="font-bold text-xl mb-6 text-white flex items-center gap-2">
                Contact Us
                <ChevronRight className="text-emerald-400/50" size={20} />
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-400">support@xupay.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-400">+1 (800) 123-4567</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-400">San Francisco, CA 94107</span>
                </li>
              </ul>
              
              {/* Newsletter signup */}
              <div className="mt-8">
                <h5 className="font-semibold text-gray-300 mb-3">Subscribe to updates</h5>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="your@email.com" 
                    className="px-4 py-3 bg-black/40 backdrop-blur-sm border border-emerald-500/20 rounded-l-lg text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                  />
                  <button className="bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-600 hover:to-cyan-500 px-4 rounded-r-lg font-medium transition-all">
                    <ArrowRight size={20} className="text-black" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-emerald-500/10">
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
              <div className="mb-4 md:mb-0">
                © {new Date().getFullYear()} {companyName}. All rights reserved. Built with ❤️ for the future of finance.
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                {['Privacy Policy', 'Terms of Service', 'Security', 'Compliance', 'Cookie Policy'].map((item, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="hover:text-emerald-400 transition-colors hover:underline"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap justify-center gap-8 text-xs text-gray-500">
              {[
                { icon: '✓', bg: 'bg-green-500', text: 'PCI DSS Compliant' },
                { icon: 'S', bg: 'bg-blue-500', text: 'SOC 2 Certified' },
                { icon: 'G', bg: 'bg-purple-500', text: 'GDPR Compliant' },
                { icon: '✓', bg: 'bg-yellow-500', text: '256-bit SSL Encryption' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`${item.bg} w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-black`}>
                    {item.icon}
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
