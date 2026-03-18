'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setSent(true)
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch {
      setError('Could not connect to server')
    }
    setIsLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif', padding: '0 16px',
    }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #9b8afb, #6d5ce7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: '20px',
          }}>✦</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Reset your password
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {sent ? (
          <div style={{
            background: 'rgba(100,255,150,0.08)', border: '1px solid rgba(100,255,150,0.2)',
            borderRadius: '10px', padding: '20px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>📬</div>
            <p style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
              Check your inbox!
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              We sent a reset link to <strong>{email}</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {error && (
              <div style={{
                background: 'rgba(255,100,100,0.1)', color: '#ff6b6b',
                fontSize: '13px', padding: '10px 14px', borderRadius: '8px',
                border: '1px solid rgba(255,100,100,0.2)',
              }}>{error}</div>
            )}
            <input
              type="email" placeholder="Your email" value={email}
              onChange={(e) => setEmail(e.target.value)} required
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '11px 14px', fontSize: '14px',
                color: 'var(--text-primary)', outline: 'none', fontFamily: 'DM Sans, sans-serif',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent-purple)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <button type="submit" disabled={isLoading} style={{
              background: 'white', color: '#191919', border: 'none',
              borderRadius: '8px', padding: '11px', fontSize: '14px',
              fontWeight: '600', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', opacity: isLoading ? 0.6 : 1,
            }}>
              {isLoading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '24px' }}>
          <Link href="/login" style={{ color: 'var(--accent-purple)', textDecoration: 'none' }}>
            ← Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}