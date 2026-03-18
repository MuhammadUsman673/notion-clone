'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { usePageStore } from '@/store/usePageStore'
import { Search, X } from 'lucide-react'

interface Props { onClose: () => void }

export default function SearchModal({ onClose }: Props) {
  const router = useRouter()
  const { pages } = usePageStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const filtered = pages.filter(p =>
    p.title?.toLowerCase().includes(query.toLowerCase()) ||
    (p.content?.text || '').toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (id: string) => {
    router.push(`/${id}`)
    onClose()
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
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 16px', borderBottom: '1px solid var(--border)',
        }}>
          <Search size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: '15px', color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif',
            }}
          />
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-tertiary)', display: 'flex', padding: '2px',
          }}>
            <X size={15} />
          </button>
        </div>

        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '8px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>
                {query ? 'No pages found' : 'Start typing to search...'}
              </p>
            </div>
          ) : (
            filtered.map(page => (
              <div key={page.id} onClick={() => handleSelect(page.id)} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
                transition: 'background 0.1s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '16px' }}>{page.icon || '📄'}</span>
                <div>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: '500' }}>
                    {page.title || 'Untitled'}
                  </p>
                  {page.content?.text && (
                    <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                      {page.content.text.slice(0, 80)}...
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{
          padding: '8px 16px', borderTop: '1px solid var(--border)',
          display: 'flex', gap: '16px',
        }}>
          {[['↵', 'to select'], ['esc', 'to close']].map(([key, label]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <kbd style={{
                background: 'var(--bg-active)', border: '1px solid var(--border)',
                borderRadius: '4px', padding: '1px 6px', fontSize: '11px',
                color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace',
              }}>{key}</kbd>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}