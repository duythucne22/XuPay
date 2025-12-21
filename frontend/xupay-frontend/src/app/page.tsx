import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to dashboard - AuthProvider will handle redirecting to login if not authenticated
  redirect('/dashboard')
}
