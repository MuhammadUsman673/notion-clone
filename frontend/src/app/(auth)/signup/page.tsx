'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'

export default function SignupPage() {
  const router = useRouter()
  const { signup, isLoading } = useAuthStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await signup(name, email, password)
      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: '360px', padding: '0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #9b8afb, #6d5ce7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: '20px',
          }}>✦</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Create an account
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Start writing with AI today
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {error && (
            <div style={{
              background: 'rgba(255,100,100,0.1)', color: '#ff6b6b',
              fontSize: '13px', padding: '10px 14px', borderRadius: '8px',
              border: '1px solid rgba(255,100,100,0.2)',
            }}>
              {error}
            </div>
          )}

          {[
            { type: 'text', placeholder: 'Full name', value: name, onChange: setName },
            { type: 'email', placeholder: 'Email', value: email, onChange: setEmail },
            { type: 'password', placeholder: 'Password', value: password, onChange: setPassword },
          ].map(({ type, placeholder, value, onChange }) => (
            <input
              key={placeholder}
              type={type} placeholder={placeholder} value={value}
              onChange={(e) => onChange(e.target.value)} required
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '11px 14px', fontSize: '14px',
                color: 'var(--text-primary)', outline: 'none', fontFamily: 'DM Sans, sans-serif',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent-purple)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          ))}

          <button
            type="submit" disabled={isLoading}
            style={{
              background: 'white', color: '#191919', border: 'none',
              borderRadius: '8px', padding: '11px', fontSize: '14px',
              fontWeight: '600', cursor: 'pointer', marginTop: '4px',
              fontFamily: 'DM Sans, sans-serif', opacity: isLoading ? 0.6 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {isLoading ? 'Creating account...' : 'Continue'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '24px' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--accent-purple)', textDecoration: 'none' }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}