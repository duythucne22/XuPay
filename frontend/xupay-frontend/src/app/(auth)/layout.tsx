'use client'

import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-screen flex overflow-hidden bg-gray-900">
      {/* LEFT SIDE - Dark Form Section */}
      <div className="w-1/2 flex flex-col items-center justify-center px-8 py-12 bg-gray-900 overflow-y-auto">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* RIGHT SIDE - Gradient Decorative Section */}
      <div className="w-1/2 relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600">
        
        {/* Top-Left Decorative Circle */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>

        {/* Middle Decorative Blob */}
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-white opacity-5 rounded-full -mr-40"></div>

        {/* Bottom Decorative Shapes */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-orange-700 to-transparent opacity-40"></div>
        
        {/* Diagonal Line Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-orange-700 opacity-20"></div>

        {/* Content Container */}
        <div className="relative h-full flex flex-col items-center justify-center px-8 z-10">
          
          {/* Welcome Message */}
          <div className="text-center text-white max-w-sm">
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              WELCOME!
            </h2>
            
            <p className="text-lg font-light leading-relaxed opacity-95">
              We're delighted to have you here. If you need any assistance, feel free to reach out.
            </p>
          </div>

          {/* Bottom Security Message */}
          <div className="absolute bottom-12 left-0 right-0 text-center">
            <p className="text-white text-sm font-medium opacity-90">
              Bank-grade security for your digital transactions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
