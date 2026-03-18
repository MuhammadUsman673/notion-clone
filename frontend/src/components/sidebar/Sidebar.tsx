'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { usePageStore } from '@/store/usePageStore'
import PageItem from './PageItem'
import SearchModal from '../search/SearchModal'
import SettingsPanel from '../settings/SettingsPanel'
import TrashModal from '../trash/TrashModal'
import { Plus, LogOut, FileText, Search, Settings, Trash2, X } from 'lucide-react'

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const router = useRouter()
  const { user, logout, checkAuth } = useAuthStore()
  const { pages, fetchPages, createPage } = usePageStore()
  const [showSearch, setShowSearch] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showTrash, setShowTrash] = useState(false)

  useEffect(() => {
    checkAuth()
    fetchPages()
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearch(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleCreatePage = async () => {
    const page = await createPage()
    router.push(`/${page.id}`)
    onClose?.()
  }

  const rootPages = pages.filter((p) => !p.parentId)

  return (
    <>
      <div style={{
        width: 'var(--sidebar-width)',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        flexShrink: 0,
      }}>
        {/* Workspace header */}
        <div style={{ padding: '12px 8px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 8px', borderRadius: '6px', cursor: 'pointer',
            transition: 'background 0.15s', flex: 1,
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{
              width: '24px', height: '24px', borderRadius: '6px',
              background: 'linear-gradient(135deg, #9b8afb, #6d5ce7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: '700', color: 'white', flexShrink: 0,
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'N'}
            </div>
            <span style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--text-primary)', flex: 1 }}>
              {user?.name ? `${user.name}'s space` : 'My space'}
            </span>
          </div>
          {/* Mobile close button */}
          {onClose && (
            <button onClick={onClose} className="sidebar-close-btn" style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-tertiary)', padding: '6px', borderRadius: '6px',
              display: 'none', alignItems: 'center',
            }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Nav items */}
        <div style={{ padding: '4px 8px' }}>
          {[
            { icon: Search, label: 'Search', action: () => setShowSearch(true) },
            { icon: Settings, label: 'Settings', action: () => setShowSettings(true) },
            { icon: Trash2, label: 'Trash', action: () => setShowTrash(true) },
          ].map(({ icon: Icon, label, action }) => (
            <div key={label} onClick={action} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '5px 8px', borderRadius: '6px', cursor: 'pointer',
              color: 'var(--text-secondary)', fontSize: '13.5px', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              <Icon size={15} />
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div style={{ height: '1px', background: 'var(--border)', margin: '6px 0' }} />

        {/* Pages section */}
        <div style={{ flex: 1, overflow: 'auto', padding: '4px 8px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '4px 8px', marginBottom: '2px',
          }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Pages
            </span>
            <button onClick={handleCreatePage} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-tertiary)', padding: '2px', borderRadius: '4px',
              display: 'flex', alignItems: 'center', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
            >
              <Plus size={14} />
            </button>
          </div>

          {rootPages.length === 0 ? (
            <div style={{ padding: '20px 8px', textAlign: 'center' }}>
              <FileText size={20} style={{ color: 'var(--text-tertiary)', margin: '0 auto 8px' }} />
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>No pages yet</p>
              <button onClick={handleCreatePage} style={{
                marginTop: '8px', fontSize: '12px', color: 'var(--accent-purple)',
                background: 'none', border: 'none', cursor: 'pointer',
              }}>
                Create one
              </button>
            </div>
          ) : (
            rootPages.map((page) => (
              <PageItem key={page.id} page={page} allPages={pages} />
            ))
          )}
        </div>

        {/* Bottom */}
        <div style={{ padding: '8px', borderTop: '1px solid var(--border)' }}>
          <button onClick={handleCreatePage} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 8px', borderRadius: '6px', cursor: 'pointer',
            background: 'none', border: 'none', color: 'var(--text-secondary)',
            fontSize: '13.5px', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            <Plus size={14} />
            New page
          </button>
          <button onClick={logout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 8px', borderRadius: '6px', cursor: 'pointer',
            background: 'none', border: 'none', color: 'var(--text-secondary)',
            fontSize: '13.5px', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>
      </div>

      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
      {showTrash && <TrashModal onClose={() => setShowTrash(false)} />}

      <style>{`
        @media (max-width: 768px) {
          .sidebar-close-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  )
}