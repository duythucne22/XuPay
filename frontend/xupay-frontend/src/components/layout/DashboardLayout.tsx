'use client'

import React, { useState } from 'react'
import { DashboardHeader } from './DashboardHeader'
import { Sidebar } from './Sidebar'
import { MobileSidebar } from './MobileSidebar'
import { Container } from './Container'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-gray-100 font-sans selection:bg-emerald-500/30">
      
      {/* Mobile Sidebar Overlay (Glass effect) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (overlay) */}
      <MobileSidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area - Offset by Sidebar width (64 = 16rem = 256px) */}
      <div className="lg:[padding-left:var(--sidebar-width)] flex flex-col min-h-screen transition-all duration-300">
        
        {/* Sticky Header */}
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 py-8">
          <Container>
            {children}
          </Container>
        </main>
      </div>
    </div>
  )
}