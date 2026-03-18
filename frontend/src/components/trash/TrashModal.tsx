'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { usePageStore } from '@/store/usePageStore'
import { Trash2, X, RotateCcw, Trash } from 'lucide-react'

interface TrashedPage {
  id: string
  title: string
  icon: string | null
  updatedAt: string
}

interface Props { onClose: () => void }

export default function TrashModal({ onClose }: Props) {
  const router = useRouter()
  const [pages, setPages] = useState<TrashedPage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTrash()
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const fetchTrash = async () => {
    try {
      const res = await api.get('/pages/trash')
      setPages(res.data.pages)
    } catch (error: any) {
      console.error('Failed to fetch trash:', error.response?.data || error.message)
    }
    setIsLoading(false)
  }

  const handleRestore = async (id: string) => {
    try {
      await api.patch(`/pages/${id}/restore`)
      setPages(prev => prev.filter(p => p.id !== id))
      const { fetchPages } = usePageStore.getState()
      await fetchPages()
      router.push(`/${id}`)
      onClose()
    } catch (error: any) {
      console.error('Failed to restore:', error.response?.data || error.message)
    }
  }

  const handlePermanentDelete = async (id: string) => {
    if (!confirm('Permanently delete this page? This cannot be undone.')) return
    try {
      await api.delete(`/pages/${id}/permanent`)
      setPages(prev => prev.filter(p => p.id !== id))
    } catch (error: any) {
      console.error('Failed to delete:', error.response?.data || error.message)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '80px 16px 0',
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: '560px', background: 'var(--bg-secondary)',
        borderRadius: '12px', border: '1px solid var(--border)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)', overflow: 'hidden',
      }} onClick={e => e.stopPropagation()}>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trash2 size={15} style={{ color: 'var(--text-tertiary)' }} />
            <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>Trash</span>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-tertiary)', display: 'flex', padding: '4px',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
          >
            <X size={15} />
          </button>
        </div>

        <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '8px' }}>
          {isLoading ? (
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', margin: '0 auto',
                border: '2px solid var(--border)', borderTopColor: 'var(--accent-purple)',
                animation: 'spin 0.8s linear infinite',
              }} />
            </div>
          ) : pages.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <Trash2 size={28} style={{ color: 'var(--text-tertiary)', margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Trash is empty</p>
            </div>
          ) : (
            pages.map(page => (
              <div key={page.id} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '8px', transition: 'background 0.1s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '16px' }}>{page.icon || '📄'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: '500',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {page.title || 'Untitled'}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    Deleted {new Date(page.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleRestore(page.id)}
                    title="Restore"
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-tertiary)', padding: '6px', borderRadius: '6px',
                      display: 'flex', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--accent-purple)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
                  >
                    <RotateCcw size={14} />
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(page.id)}
                    title="Delete permanently"
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-tertiary)', padding: '6px', borderRadius: '6px',
                      display: 'flex', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,100,100,0.1)'; e.currentTarget.style.color = '#ff6b6b' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {pages.length > 0 && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center' }}>
              Pages in trash are kept for 30 days
            </p>
          </div>
        )}
      </div>
    </div>
  )
}