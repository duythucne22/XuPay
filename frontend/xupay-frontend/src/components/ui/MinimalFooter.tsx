import React from 'react'
import Container from './Container'

export default function MinimalFooter() {
  return (
    <footer className="border-t mt-12">
      <Container className="py-6 text-sm text-gray-600">© {new Date().getFullYear()} XUPAY — Built with care.</Container>
    </footer>
  )
}
