'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePageStore } from '@/store/usePageStore'
import { Page } from '@/types'
import { ChevronRight, Plus, Trash2 } from 'lucide-react'

interface Props {
  page: Page
  allPages: Page[]
  depth?: number
}

export default function PageItem({ page, allPages, depth = 0 }: Props) {
  const router = useRouter()
  const { createPage, deletePage } = usePageStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const children = allPages.filter((p) => p.parentId === page.id)

  const handleCreate = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const newPage = await createPage(page.id)
    setIsOpen(true)
    router.push(`/${newPage.id}`)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await deletePage(page.id)
    router.push('/dashboard')
  }

  return (
    <div>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '4px 8px', paddingLeft: `${depth * 14 + 8}px`,
          borderRadius: '6px', cursor: 'pointer', transition: 'background 0.1s',
          background: isHovered ? 'var(--bg-hover)' : 'transparent',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => router.push(`/${page.id}`)}
      >
        <button
          onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen) }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-tertiary)', padding: '1px', display: 'flex',
            flexShrink: 0,
          }}
        >
          <ChevronRight size={12} style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
        </button>
        <span style={{ fontSize: '13px', flexShrink: 0 }}>{page.icon || '📄'}</span>
        <span style={{
          fontSize: '13.5px', color: 'var(--text-primary)', flex: 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {page.title || 'Untitled'}
        </span>
        {/* Always show on mobile, hover on desktop */}
        <div className="page-actions" style={{ display: 'flex', gap: '2px' }}>
          <button onClick={handleCreate} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-tertiary)', padding: '2px', borderRadius: '3px',
            display: 'flex',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
          >
            <Plus size={12} />
          </button>
          <button onClick={handleDelete} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-tertiary)', padding: '2px', borderRadius: '3px',
            display: 'flex',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#ff6b6b'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      {isOpen && children.map((child) => (
        <PageItem key={child.id} page={child} allPages={allPages} depth={depth + 1} />
      ))}

      <style>{`
        .page-actions {
          display: none;
        }
        div:hover > div > .page-actions,
        .page-actions:hover {
          display: flex;
        }
        @media (max-width: 768px) {
          .page-actions {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  )
}