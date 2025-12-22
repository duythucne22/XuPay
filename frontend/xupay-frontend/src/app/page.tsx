import { Suspense } from 'react'
import HomePageContent from '@/components/home'

export const metadata = {
  title: 'XuPay - Digital Wallet & Payment Solutions',
  description: 'Manage your digital wallets and payments securely with XuPay. Sign up today to experience seamless financial management.',
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomePageContent
        companyName="XuPay"
        primaryColor="#22c55e"
        accentColor="#00C853"
      />
    </Suspense>
  )
}
