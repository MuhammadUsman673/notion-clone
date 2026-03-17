'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePageStore } from '@/store/usePageStore'
import { Plus, Sparkles } from 'lucide-react'
import TemplatesModal from '@/components/templates/TemplatesModal'

export default function DashboardHome() {
  const router = useRouter()
  const { createPage, updatePage } = usePageStore()
  const [showTemplates, setShowTemplates] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleSelectTemplate = async (template: any) => {
    if (isCreating) return
    setIsCreating(true)
    setShowTemplates(false)
    try {
      const page = await createPage()
      if (template.id !== 'blank') {
        await updatePage(page.id, {
          icon: template.icon,
          title: template.name,
          content: { text: template.content },
        })
      }
      router.push(`/${page.id}`)
    } catch (error) {
      console.error('Failed to create page:', error)
    }
    setIsCreating(false)
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%', textAlign: 'center', padding: '40px',
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>✦</div>
      <h1 style={{ fontSize: '26px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
        Your workspace
      </h1>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '340px', marginBottom: '32px', lineHeight: '1.6' }}>
        Create a new page to start writing, planning, and organizing with AI.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '240px' }}>
        <button
          onClick={() => setShowTemplates(true)}
          disabled={isCreating}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
            background: 'white', color: '#191919', border: 'none',
            fontSize: '13.5px', fontWeight: '600', transition: 'opacity 0.15s',
            opacity: isCreating ? 0.6 : 1,
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = isCreating ? '0.6' : '1'}
        >
          <Plus size={15} />
          {isCreating ? 'Creating...' : 'New page'}
        </button>
        <button
          onClick={() => setShowTemplates(true)}
          disabled={isCreating}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
            background: 'rgba(155,138,251,0.15)', color: 'var(--accent-purple)',
            border: '1px solid rgba(155,138,251,0.25)',
            fontSize: '13.5px', fontWeight: '600', transition: 'all 0.15s',
            opacity: isCreating ? 0.6 : 1,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(155,138,251,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(155,138,251,0.15)'}
        >
          <Sparkles size={15} />
          New AI page
        </button>
      </div>

      {showTemplates && (
        <TemplatesModal
          onSelect={handleSelectTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  )
}