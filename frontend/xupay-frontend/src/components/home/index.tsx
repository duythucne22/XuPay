'use client'

import ParticleBackground from './ParticleBackground'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import FeaturesGrid from './FeaturesGrid'
import SocialProof from './SocialProof'
import CTASection from './CTASection'
import Footer from './Footer'

interface HomePageProps {
  companyName?: string
  primaryColor?: string
  accentColor?: string
}

export default function HomePageContent({
  companyName = 'XuPay',
}: HomePageProps) {
  return (
    <div className="min-h-screen font-sans text-gray-200 overflow-x-hidden relative bg-[#0a0a0a]">
      {/* Optimization: 
        ParticleBackground is memoized and sits at z-0.
        The gradient overlay sits at z-0.
        All content sits at z-10.
      */}
      <ParticleBackground />
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e] opacity-90 pointer-events-none" />
      
      {/* Main Content */}
      <div className="relative z-10">
        <Navbar companyName={companyName} />
        <HeroSection companyName={companyName} />
        <FeaturesGrid companyName={companyName} />
        <SocialProof />
        <CTASection companyName={companyName} />
        <Footer companyName={companyName} />
      </div>
    </div>
  )
}