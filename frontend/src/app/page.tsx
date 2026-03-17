'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function Home() {
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'authenticated') {
      router.replace('/dashboard')
      return
    }

    const token = localStorage.getItem('token')
    if (token) {
      router.replace('/dashboard')
    } else {
      router.replace('/login')
    }
  }, [status])

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