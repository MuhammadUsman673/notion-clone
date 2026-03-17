'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePageStore } from '@/store/usePageStore'
import Editor from '@/components/editor/Editor'
import AIPanel from '@/components/ai/AIPanel'
import { Sparkles } from 'lucide-react'

export default function PageDetail() {
  const { pageId } = useParams()
  const router = useRouter()
  const { currentPage, fetchPage } = usePageStore()
  const [showAI, setShowAI] = useState(false)

  useEffect(() => {
    if (pageId && pageId !== 'dashboard') {
      fetchPage(pageId as string).catch(() => router.replace('/dashboard'))
    }
  }, [pageId])

  if (pageId === 'dashboard') return null

  if (!currentPage) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%',
          border: '2px solid var(--border)', borderTopColor: 'var(--accent-purple)',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Topbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '8px 20px', borderBottom: '1px solid var(--border)',
          position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10,
        }}>
          <button
            onClick={() => setShowAI(!showAI)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 12px', borderRadius: '6px', cursor: 'pointer',
              fontSize: '13px', border: 'none', transition: 'all 0.15s',
              background: showAI ? 'rgba(155,138,251,0.15)' : 'var(--bg-hover)',
              color: showAI ? 'var(--accent-purple)' : 'var(--text-secondary)',
            }}
          >
            <Sparkles size={13} />
            AI Assistant
          </button>
        </div>
        <Editor page={currentPage} />
      </div>
      {showAI && <AIPanel onClose={() => setShowAI(false)} />}
    </div>
  )
}