'use client'
import { useState, useEffect, useRef } from 'react'
import { usePageStore } from '@/store/usePageStore'
import { Page } from '@/types'
import ReactMarkdown from 'react-markdown'
import EmojiPicker from 'emoji-picker-react'
import api from '@/lib/api'
import { ImagePlus, Loader2, Upload, X } from 'lucide-react'

interface Props {
  page: Page
}

function getWordCount(text: string) {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length
}

function getReadingTime(wordCount: number) {
  const minutes = Math.ceil(wordCount / 200)
  return minutes < 1 ? 'Less than 1 min read' : `${minutes} min read`
}

export default function Editor({ page }: Props) {
  const { updatePage } = usePageStore()
  const [content, setContent] = useState(page.content?.text || '')
  const [title, setTitle] = useState(page.title || '')
  const [isEditing, setIsEditing] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [icon, setIcon] = useState(page.icon || '📄')
  const [cover, setCover] = useState(page.cover || '')
  const [isUploading, setIsUploading] = useState(false)
  const [isCoverUploading, setIsCoverUploading] = useState(false)
  const [showCoverHover, setShowCoverHover] = useState(false)
  const emojiRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setContent(page.content?.text || '')
    setTitle(page.title || '')
    setIcon(page.icon || '📄')
    setCover(page.cover || '')
  }, [page.id])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleEmojiClick = (emojiData: any) => {
    setIcon(emojiData.emoji)
    updatePage(page.id, { icon: emojiData.emoji })
    setShowEmojiPicker(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const imageMarkdown = `\n![${file.name}](${res.data.url})\n`
      const textarea = textareaRef.current
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newContent = content.slice(0, start) + imageMarkdown + content.slice(end)
        setContent(newContent)
        updatePage(page.id, { content: { text: newContent } })
      } else {
        const newContent = content + imageMarkdown
        setContent(newContent)
        updatePage(page.id, { content: { text: newContent } })
      }
    } catch {
      alert('Image upload failed. Please try again.')
    }
    setIsUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsCoverUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setCover(res.data.url)
      updatePage(page.id, { cover: res.data.url })
    } catch {
      alert('Cover upload failed. Please try again.')
    }
    setIsCoverUploading(false)
    if (coverInputRef.current) coverInputRef.current.value = ''
  }

  const handleRemoveCover = () => {
    setCover('')
    updatePage(page.id, { cover: '' })
  }

  const wordCount = getWordCount(content)
  const readingTime = getReadingTime(wordCount)

  return (
    <div>
      {/* Cover image */}
      {cover ? (
        <div
          style={{ position: 'relative', width: '100%', height: '280px' }}
          onMouseEnter={() => setShowCoverHover(true)}
          onMouseLeave={() => setShowCoverHover(false)}
        >
          <img
            src={cover} alt="Cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {showCoverHover && (
            <div style={{
              position: 'absolute', bottom: '12px', right: '12px',
              display: 'flex', gap: '8px',
            }}>
              <button
                onClick={() => coverInputRef.current?.click()}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '6px', cursor: 'pointer',
                  background: 'rgba(0,0,0,0.6)', color: 'white',
                  border: 'none', fontSize: '12px', backdropFilter: 'blur(4px)',
                }}
              >
                <Upload size={12} />
                Change cover
              </button>
              <button
                onClick={handleRemoveCover}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '6px', cursor: 'pointer',
                  background: 'rgba(0,0,0,0.6)', color: 'white',
                  border: 'none', fontSize: '12px', backdropFilter: 'blur(4px)',
                }}
              >
                <X size={12} />
                Remove
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* Page content */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: cover ? '32px 60px 120px' : '60px 60px 120px' }}>

        {/* Add cover button (when no cover) */}
        {!cover && (
          <div style={{ marginBottom: '8px' }}>
            <button
              onClick={() => coverInputRef.current?.click()}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '12px', padding: '4px 8px', borderRadius: '5px',
                border: 'none', cursor: 'pointer', background: 'transparent',
                color: 'var(--text-tertiary)', fontFamily: 'DM Sans, sans-serif',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
            >
              {isCoverUploading
                ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                : <ImagePlus size={12} />
              }
              {isCoverUploading ? 'Uploading...' : 'Add cover'}
            </button>
          </div>
        )}

        {/* Hidden cover input */}
        <input
          ref={coverInputRef}
          type="file" accept="image/*"
          style={{ display: 'none' }}
          onChange={handleCoverUpload}
        />

        {/* Icon with picker */}
        <div ref={emojiRef} style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
          <div
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            style={{
              fontSize: '52px', lineHeight: 1, cursor: 'pointer',
              borderRadius: '8px', padding: '4px', transition: 'background 0.15s',
              display: 'inline-block',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            title="Click to change icon"
          >
            {icon}
          </div>
          {showEmojiPicker && (
            <div style={{ position: 'absolute', top: '64px', left: 0, zIndex: 100 }}>
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme={'dark' as any}
                height={400}
                width={320}
              />
            </div>
          )}
        </div>

        {/* Title */}
        <input
          style={{
            width: '100%', fontSize: '38px', fontWeight: '700',
            color: 'var(--text-primary)', background: 'transparent',
            border: 'none', outline: 'none', fontFamily: 'DM Sans, sans-serif',
            marginBottom: '8px', display: 'block', lineHeight: '1.2',
          }}
          placeholder="Untitled"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => updatePage(page.id, { title })}
        />

        {/* Word count & reading time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>·</span>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{readingTime}</span>
        </div>

        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          marginBottom: '16px', flexWrap: 'wrap',
        }}>
          {['Edit', 'Preview'].map((mode) => (
            <button key={mode} onClick={() => setIsEditing(mode === 'Edit')} style={{
              fontSize: '12px', padding: '3px 10px', borderRadius: '5px',
              border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              background: (mode === 'Edit') === isEditing ? 'var(--bg-active)' : 'transparent',
              color: (mode === 'Edit') === isEditing ? 'var(--text-primary)' : 'var(--text-tertiary)',
              transition: 'all 0.15s',
            }}>
              {mode}
            </button>
          ))}

          <div style={{ width: '1px', height: '16px', background: 'var(--border)' }} />

          <input
            ref={fileInputRef}
            type="file" accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: '12px', padding: '3px 10px', borderRadius: '5px',
              border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              background: 'transparent', color: 'var(--text-tertiary)',
              transition: 'all 0.15s', opacity: isUploading ? 0.6 : 1,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
          >
            {isUploading
              ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
              : <ImagePlus size={13} />
            }
            {isUploading ? 'Uploading...' : 'Add Image'}
          </button>
        </div>

        {/* Editor / Preview */}
        {isEditing ? (
          <textarea
            ref={textareaRef}
            autoFocus
            style={{
              width: '100%', minHeight: '60vh',
              fontSize: '15px', lineHeight: '1.75',
              color: 'var(--text-primary)', background: 'transparent',
              border: 'none', outline: 'none', resize: 'none',
              fontFamily: 'DM Mono, monospace',
            }}
            placeholder="Write in markdown... e.g. ## Heading, **bold**, - list item"
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
              updatePage(page.id, { content: { text: e.target.value } })
            }}
          />
        ) : (
          <div onClick={() => setIsEditing(true)} style={{ minHeight: '60vh', cursor: 'text' }}>
            {content ? (
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 style={{ fontSize: '30px', fontWeight: '700', color: 'var(--text-primary)', margin: '32px 0 12px', lineHeight: 1.3 }}>{children}</h1>,
                  h2: ({ children }) => <h2 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--text-primary)', margin: '28px 0 10px', lineHeight: 1.3 }}>{children}</h2>,
                  h3: ({ children }) => <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', margin: '20px 0 8px' }}>{children}</h3>,
                  p: ({ children }) => <p style={{ fontSize: '15px', lineHeight: '1.75', color: 'var(--text-primary)', margin: '0 0 14px' }}>{children}</p>,
                  ul: ({ children }) => <ul style={{ paddingLeft: '24px', margin: '8px 0 14px' }}>{children}</ul>,
                  ol: ({ children }) => <ol style={{ paddingLeft: '24px', margin: '8px 0 14px' }}>{children}</ol>,
                  li: ({ children }) => <li style={{ fontSize: '15px', lineHeight: '1.75', color: 'var(--text-primary)', marginBottom: '4px' }}>{children}</li>,
                  strong: ({ children }) => <strong style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{children}</strong>,
                  em: ({ children }) => <em style={{ color: 'var(--text-secondary)' }}>{children}</em>,
                  code: ({ children }) => <code style={{ background: 'var(--bg-active)', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'DM Mono, monospace', color: 'var(--accent-purple)' }}>{children}</code>,
                  pre: ({ children }) => <pre style={{ background: 'var(--bg-active)', padding: '16px 20px', borderRadius: '8px', margin: '16px 0', overflowX: 'auto', fontSize: '13px', fontFamily: 'DM Mono, monospace', border: '1px solid var(--border)' }}>{children}</pre>,
                  blockquote: ({ children }) => <blockquote style={{ borderLeft: '3px solid var(--accent-purple)', paddingLeft: '16px', margin: '16px 0', color: 'var(--text-secondary)' }}>{children}</blockquote>,
                  hr: () => <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />,
                  img: ({ src, alt }) => <img src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: '8px', margin: '16px 0', display: 'block', border: '1px solid var(--border)' }} />,
                }}
              >
                {content}
              </ReactMarkdown>
            ) : (
              <p style={{ color: 'var(--text-tertiary)', fontSize: '15px', cursor: 'text' }}>
                Start writing, or press AI Assistant to generate content...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}