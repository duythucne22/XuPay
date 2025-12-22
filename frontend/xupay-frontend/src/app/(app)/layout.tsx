/* ============================================
   APP LAYOUT - Authenticated pages layout
   Route Group: (app)
   ============================================ */

import type { ReactNode } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>
}
