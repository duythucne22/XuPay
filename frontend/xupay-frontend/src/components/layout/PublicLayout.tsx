'use client'

import React from 'react'
import { Container } from './Container'

interface PublicLayoutProps {
  children: React.ReactNode
}

/**
 * PublicLayout - For marketing and public pages
 * 
 * Structure:
 * - Header (fixed, z-50)
 * - Main content (scrollable, full-width)
 * - Footer (full-width)
 * 
 * No sidebar, no topbar
 * Responsive: mobile/tablet/desktop
 */
export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Fixed Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
        style={{ height: '3.5rem' }}
      >
        <nav className="h-full px-4 md:px-6 flex items-center justify-between max-w-full">
          {/* Logo */}
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            XuPay
          </div>
          
          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Pricing
            </a>
            <a href="#docs" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Docs
            </a>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              Login
            </a>
            <a
              href="/register"
              className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
            >
              Get Started
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content - Offset by header height */}
      <main className="flex-1 pt-[3.5rem]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <Container>
          <div className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">XuPay</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Secure, fast, and reliable payment solutions.
                </p>
              </div>
              
              {/* Product */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Features</a></li>
                  <li><a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Pricing</a></li>
                  <li><a href="#security" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Security</a></li>
                </ul>
              </div>
              
              {/* Company */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">About</a></li>
                  <li><a href="#blog" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Blog</a></li>
                  <li><a href="#careers" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Careers</a></li>
                </ul>
              </div>
              
              {/* Legal */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Privacy</a></li>
                  <li><a href="#terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Terms</a></li>
                  <li><a href="#contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Contact</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                 2025 XuPay. All rights reserved.
              </p>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <a href="#twitter" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Twitter</a>
                <a href="#github" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">GitHub</a>
                <a href="#linkedin" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">LinkedIn</a>
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  )
}
