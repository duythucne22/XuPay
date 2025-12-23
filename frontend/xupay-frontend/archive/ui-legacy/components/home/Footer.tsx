'use client'

import { Wallet, Mail, Phone, MapPin, Twitter, Linkedin, Github, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function Footer({ companyName }: { companyName: string }) {
  return (
    <footer className="py-16 px-4 border-t border-[var(--color-border-neon)] bg-[var(--color-bg-secondary)] relative overflow-hidden z-10">
       
       {/* Background Glow */}
       <div className="absolute inset-x-0 top-0 h-px">
         <div className="max-w-[1400px] mx-auto h-px bg-gradient-to-r from-transparent via-[var(--color-neon-teal)] to-transparent opacity-50" />
       </div> 
       
       <div className="max-w-[1400px] mx-auto relative z-10">
          
          {/* Main Content Wrapper: Desktop-first horizontal layout */}
          <div className="flex flex-row gap-24 mb-16">
            
            {/* 1. Brand Section (Left Side - 1/3 width on Desktop) */}
            <div className="w-1/3">
              <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
                <div className="relative">
                  <div className="absolute inset-0 bg-[var(--color-neon-teal)]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Wallet className="text-[var(--color-neon-teal)] relative z-10" size={32} />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-[var(--color-neon-teal)] to-[var(--color-neon-purple)] bg-clip-text text-transparent">
                  {companyName}
                </span>
              </Link>
              <p className="mb-8 text-[var(--color-text-secondary)] leading-relaxed">
                Revolutionizing digital asset payments with cutting-edge security, lightning-fast transactions, and seamless integration for the future of finance.
              </p>
              <div className="flex space-x-4">
                {[Twitter, Linkedin, Github].map((Icon, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-neon-teal)] hover:border-[var(--color-neon-teal)] hover:shadow-[var(--shadow-neon-teal)] transition-all"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* 2. Links Section (Right Side - 2/3 width on Desktop) */}
            <div className="flex-1 grid grid-cols-3 gap-12">
              
              {/* Platform */}
              <div>
                <h4 className="font-bold text-lg mb-6 text-[var(--color-text-primary)]">Platform</h4>
                <ul className="space-y-4">
                  {['Capital', 'Business Card', 'Insights', 'Pricing'].map(item => (
                    <li key={item}>
                      <Link href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-neon-teal)] transition-colors flex items-center gap-2 group">
                        <ChevronRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[var(--color-neon-teal)]" />
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-bold text-lg mb-6 text-[var(--color-text-primary)]">Company</h4>
                <ul className="space-y-4">
                  {['About Us', 'Careers', 'Blog', 'Press'].map(item => (
                    <li key={item}>
                      <Link href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-neon-teal)] transition-colors flex items-center gap-2 group">
                        <ChevronRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[var(--color-neon-teal)]" />
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

               {/* Contact */}
               <div>
                <h4 className="font-bold text-lg mb-6 text-[var(--color-text-primary)]">Contact</h4>
                <ul className="space-y-5 text-[var(--color-text-secondary)]">
                  <li className="flex items-start gap-3">
                    <Mail className="text-[var(--color-neon-teal)] shrink-0 mt-1" size={18}/> 
                    <span className="hover:text-[var(--color-text-primary)] transition-colors cursor-pointer">support@xupay.com</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="text-[var(--color-neon-teal)] shrink-0 mt-1" size={18}/> 
                    <span className="hover:text-[var(--color-text-primary)] transition-colors cursor-pointer">+1 (888) 123-4567</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="text-[var(--color-neon-teal)] shrink-0 mt-1" size={18}/> 
                    <span>123 Finance Way,<br/>San Francisco, CA</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[var(--color-border-default)] flex flex-row justify-between items-center gap-4 text-sm text-[var(--color-text-muted)]">
             <div>
               © {new Date().getFullYear()} {companyName}. All rights reserved.
             </div>
             <div className="flex gap-8">
               <Link href="#" className="hover:text-[var(--color-neon-teal)] transition-colors">Privacy Policy</Link>
               <Link href="#" className="hover:text-[var(--color-neon-teal)] transition-colors">Terms of Service</Link>
               <Link href="#" className="hover:text-[var(--color-neon-teal)] transition-colors">Cookies</Link>
             </div>
          </div>
       </div>
    </footer>
  )
}