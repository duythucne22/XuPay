/* ============================================
   APP LAYOUT - Authenticated pages layout
   Route Group: (app)
   ============================================ */

import type { ReactNode } from 'react'
import { AppShell } from '@/components/layout'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return <AppShell>{children}</AppShell>
}
