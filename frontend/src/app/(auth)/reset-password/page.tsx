'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function ResetForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) return setError('Passwords do not match')
    if (password.length < 6) return setError('Password must be at least 6 characters')
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push('/login'), 2000)
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch {
      setError('Could not connect to server')
    }
    setIsLoading(false)
  }

  if (!token) {
    return (
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#ff6b6b', fontSize: '14px' }}>Invalid reset link.</p>
        <Link href="/forgot-password" style={{ color: 'var(--accent-purple)', fontSize: '13px' }}>
          Request a new one
        </Link>
      </div>
    )
  }

  return success ? (
    <div style={{
      background: 'rgba(100,255,150,0.08)', border: '1px solid rgba(100,255,150,0.2)',
      borderRadius: '10px', padding: '20px', textAlign: 'center',
    }}>
      <div style={{ fontSize: '28px', marginBottom: '10px' }}>✅</div>
      <p style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500' }}>
        Password reset! Redirecting to login...
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
        type="password" placeholder="New password" value={password}
        onChange={(e) => setPassword(e.target.value)} required
        style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          borderRadius: '8px', padding: '11px 14px', fontSize: '14px',
          color: 'var(--text-primary)', outline: 'none', fontFamily: 'DM Sans, sans-serif',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent-purple)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
      <input
        type="password" placeholder="Confirm new password" value={confirm}
        onChange={(e) => setConfirm(e.target.value)} required
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
        {isLoading ? 'Resetting...' : 'Reset password'}
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: '360px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #9b8afb, #6d5ce7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: '20px',
          }}>✦</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
            New password
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Choose a strong password
          </p>
        </div>
        <Suspense fallback={<div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Loading...</div>}>
          <ResetForm />
        </Suspense>
        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '24px' }}>
          <Link href="/login" style={{ color: 'var(--accent-purple)', textDecoration: 'none' }}>
            ← Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}