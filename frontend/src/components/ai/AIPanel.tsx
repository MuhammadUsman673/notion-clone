'use client'
import { useState } from 'react'
import { usePageStore } from '@/store/usePageStore'
import api from '@/lib/api'
import { Sparkles, X, Send, Loader2 } from 'lucide-react'

interface Props { onClose: () => void }

export default function AIPanel({ onClose }: Props) {
  const { currentPage, updatePage } = usePageStore()
  const [input, setInput] = useState('')
  const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    if (!input.trim()) return
    setIsLoading(true)
    try {
      const res = await api.post('/ai/generate', { prompt: input })
      updatePage(currentPage!.id, { content: { text: res.data.text } })
      setChatHistory(prev => [...prev,
        { role: 'user', text: input },
        { role: 'ai', text: '✓ Page generated successfully!' }
      ])
      setInput('')
    } catch {
      setChatHistory(prev => [...prev, { role: 'ai', text: 'Something went wrong.' }])
    }
    setIsLoading(false)
  }

  const handleSummarize = async () => {
    if (!currentPage?.content?.text) return
    setIsLoading(true)
    try {
      const res = await api.post('/ai/summarize', { content: currentPage.content.text })
      setChatHistory(prev => [...prev,
        { role: 'user', text: 'Summarize this page' },
        { role: 'ai', text: res.data.summary }
      ])
    } catch {
      setChatHistory(prev => [...prev, { role: 'ai', text: 'Something went wrong.' }])
    }
    setIsLoading(false)
  }

  const handleChat = async () => {
    if (!input.trim()) return
    setIsLoading(true)
    const userMessage = input
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }])
    setInput('')
    try {
      const res = await api.post('/ai/chat', {
        message: userMessage,
        context: currentPage?.content?.text || ''
      })
      setChatHistory(prev => [...prev, { role: 'ai', text: res.data.reply }])
    } catch {
      setChatHistory(prev => [...prev, { role: 'ai', text: 'Something went wrong.' }])
    }
    setIsLoading(false)
  }

  return (
    <div style={{
      width: '320px', height: '100vh', flexShrink: 0,
      background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={15} style={{ color: 'var(--accent-purple)' }} />
          <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>AI Assistant</span>
        </div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-tertiary)', display: 'flex', padding: '4px', borderRadius: '4px',
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
        >
          <X size={15} />
        </button>
      </div>

      {/* Quick actions */}
      <div style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>
        <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Actions</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { label: 'Summarize this page', action: handleSummarize },
            { label: 'Write an introduction', action: () => setInput('Write an introduction for this page') },
            { label: 'Generate action items', action: () => setInput('Generate action items from this page') },
          ].map(({ label, action }) => (
            <button key={label} onClick={action} style={{
              textAlign: 'left', fontSize: '13px', padding: '7px 10px',
              borderRadius: '6px', cursor: 'pointer', border: 'none',
              background: 'var(--bg-active)', color: 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {chatHistory.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Sparkles size={24} style={{ color: 'var(--text-tertiary)', margin: '0 auto 8px' }} />
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Ask anything about your notes</p>
          </div>
        )}
        {chatHistory.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '88%', fontSize: '13px', padding: '8px 12px',
              borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              background: msg.role === 'user' ? 'var(--accent-purple)' : 'var(--bg-active)',
              color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
              lineHeight: '1.5',
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: 'var(--bg-active)', padding: '10px 14px', borderRadius: '12px' }}>
              <Loader2 size={13} style={{ color: 'var(--text-tertiary)', animation: 'spin 1s linear infinite' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
        <div style={{
          display: 'flex', gap: '8px', alignItems: 'center',
          background: 'var(--bg-active)', borderRadius: '8px',
          padding: '6px 6px 6px 12px', border: '1px solid var(--border)',
        }}>
          <input
            type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChat()}
            placeholder="Ask AI anything..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif',
            }}
          />
          <button onClick={handleChat} disabled={isLoading} style={{
            background: 'var(--accent-purple)', border: 'none', cursor: 'pointer',
            color: 'white', padding: '6px 8px', borderRadius: '6px', display: 'flex',
          }}>
            <Send size={13} />
          </button>
        </div>
        <button onClick={handleGenerate} style={{
          width: '100%', marginTop: '6px', padding: '8px',
          background: 'none', border: '1px solid var(--border)',
          borderRadius: '8px', cursor: 'pointer', color: 'var(--accent-purple)',
          fontSize: '12.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <Sparkles size={12} />
          Generate page from prompt
        </button>
      </div>
    </div>
  )
}