import React from 'react'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import MinimalHeader from '@/components/ui/MinimalHeader'
import MinimalFooter from '@/components/ui/MinimalFooter'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <MinimalHeader />
      <main>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <h1 className="text-5xl font-extrabold leading-tight mb-6">Modern finance, simplified.</h1>
              <p className="text-lg text-gray-600 mb-8">A clean, focused wallet and transaction experience built for desktop. Fast, secure, and beautiful.</p>

              <div className="flex gap-4">
                <Link href="/(auth)/login" className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold shadow">Get started</Link>
                <Link href="/(app)/dashboard" className="inline-block border border-gray-200 px-6 py-3 rounded-lg text-gray-700">Go to dashboard</Link>
              </div>

              <div className="mt-10 text-sm text-gray-500">Designed for desktop & laptop — responsive down to mobile.</div>
            </div>

            <div className="hidden lg:col-span-6 lg:flex lg:items-center lg:justify-center">
              <div className="w-full max-w-md bg-gray-50 border rounded-2xl p-8 shadow">
                <div className="text-xs text-gray-500">Wallet</div>
                <div className="mt-4 text-3xl font-semibold">$12,450.00</div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg border">Income<div className="text-xl font-semibold mt-2">$2,345</div></div>
                  <div className="p-4 bg-white rounded-lg border">Expenses<div className="text-xl font-semibold mt-2">$840</div></div>
                </div>
              </div>
            </div>
          </div>
        </Container>

        <section className="bg-gray-50 py-12">
          <Container>
            <h2 className="text-2xl font-semibold mb-6">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-lg border">Fast payments</div>
              <div className="p-6 bg-white rounded-lg border">Real-time insights</div>
              <div className="p-6 bg-white rounded-lg border">Enterprise grade security</div>
            </div>
          </Container>
        </section>
      </main>

      <MinimalFooter />
    </div>
  )
}
