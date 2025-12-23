import React from 'react'
import Link from 'next/link'
import Container from './Container'

export default function MinimalHeader() {
  return (
    <header className="bg-white shadow-sm">
      <Container className="flex items-center justify-between">
        <div className="text-2xl font-semibold tracking-tight">XUPAY</div>
        <nav className="hidden md:flex gap-8 items-center">
          <Link className="text-gray-700 hover:text-gray-900" href="/">Home</Link>
          <Link className="text-gray-700 hover:text-gray-900" href="/(app)/dashboard">Dashboard</Link>
          <Link className="text-gray-700 hover:text-gray-900" href="/(app)/wallets">Wallets</Link>
        </nav>
      </Container>
    </header>
  )
}
