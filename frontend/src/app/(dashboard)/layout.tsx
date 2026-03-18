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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'authenticated' && session?.accessToken) {
      localStorage.setItem('token', session.accessToken)
      setChecked(true)
      return
    }
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
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.5)',
            display: 'none',
          }}
          className="mobile-overlay"
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)', minWidth: 0 }}>
        {/* Mobile top bar */}
        <div className="mobile-topbar">
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-primary)', padding: '8px', display: 'flex',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>My Space</span>
          <div style={{ width: '34px' }} />
        </div>

        {children}
      </main>

      <style>{`
        .sidebar-wrapper {
          flex-shrink: 0;
        }
        .mobile-topbar {
          display: none;
        }
        @media (max-width: 768px) {
          .sidebar-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 50;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }
          .sidebar-wrapper.sidebar-open {
            transform: translateX(0);
          }
          .mobile-overlay {
            display: block !important;
          }
          .mobile-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 16px;
            border-bottom: 1px solid var(--border);
            background: var(--bg-secondary);
            position: sticky;
            top: 0;
            z-index: 10;
          }
        }
      `}</style>
    </div>
  )
}