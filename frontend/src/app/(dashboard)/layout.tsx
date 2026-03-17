'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useAuthStore } from '@/store/useAuthStore'
import Sidebar from '@/components/sidebar/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { checkAuth } = useAuthStore()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'authenticated' && session?.accessToken) {
      // Store the token from NextAuth session
      localStorage.setItem('token', session.accessToken)
      setChecked(true)
      return
    }

    // Fall back to manual JWT token
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
    } else {
      checkAuth().then(() => setChecked(true))
    }
  }, [status, session])

  if (!checked || status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%',
          border: '2px solid var(--border)', borderTopColor: 'var(--accent-purple)',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
        {children}
      </main>
    </div>
  )
}