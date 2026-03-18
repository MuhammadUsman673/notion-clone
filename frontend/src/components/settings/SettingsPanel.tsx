'use client'
import { useAuthStore } from '@/store/useAuthStore'
import { useThemeStore } from '@/store/useThemeStore'
import { useRouter } from 'next/navigation'
import { X, User, Mail, LogOut, Shield, Moon, Sun } from 'lucide-react'

interface Props { onClose: () => void }

export default function SettingsPanel({ onClose }: Props) {
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: '480px', background: 'var(--bg-secondary)',
        borderRadius: '12px', border: '1px solid var(--border)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)', overflow: 'hidden',
      }} onClick={e => e.stopPropagation()}>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>Settings</h2>
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

        <div style={{ padding: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            Account
          </p>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '14px', background: 'var(--bg-active)', borderRadius: '10px',
            marginBottom: '16px',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #9b8afb, #6d5ce7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: '700', color: 'white', flexShrink: 0,
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'User'}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email || ''}
              </p>
            </div>
          </div>

          {[
            { icon: User, label: 'Name', value: user?.name || '—' },
            { icon: Mail, label: 'Email', value: user?.email || '—' },
            { icon: Shield, label: 'Account type', value: 'Free plan' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 0', borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={14} style={{ color: 'var(--text-tertiary)' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</span>
              </div>
              <span style={{ fontSize: '13px', color: 'var(--text-primary)', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
            </div>
          ))}

          <div style={{ marginTop: '20px', marginBottom: '8px' }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              Appearance
            </p>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', background: 'var(--bg-active)', borderRadius: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {theme === 'dark' ? <Moon size={14} style={{ color: 'var(--text-tertiary)' }} /> : <Sun size={14} style={{ color: 'var(--text-tertiary)' }} />}
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                </span>
              </div>
              <div
                onClick={toggleTheme}
                style={{
                  width: '36px', height: '20px', borderRadius: '10px', cursor: 'pointer',
                  background: theme === 'dark' ? 'var(--accent-purple)' : 'var(--bg-hover)',
                  position: 'relative', transition: 'background 0.2s',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{
                  position: 'absolute', top: '2px',
                  left: theme === 'dark' ? '18px' : '2px',
                  width: '14px', height: '14px', borderRadius: '50%',
                  background: 'white', transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }} />
              </div>
            </div>
          </div>

          <button onClick={handleLogout} style={{
            width: '100%', marginTop: '12px', padding: '10px',
            background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.2)',
            borderRadius: '8px', cursor: 'pointer', color: '#ff6b6b',
            fontSize: '13.5px', fontWeight: '500', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,100,100,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,100,100,0.08)'}
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}