import { create } from 'zustand'
import { User } from '@/types'
import api from '@/lib/api'

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true })
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    set({ user: res.data.user, token: res.data.token, isLoading: false })
  },

  signup: async (name, email, password) => {
    set({ isLoading: true })
    const res = await api.post('/auth/signup', { name, email, password })
    localStorage.setItem('token', res.data.token)
    set({ user: res.data.user, token: res.data.token, isLoading: false })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
    window.location.href = '/login'
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await api.get('/auth/me')
      set({ user: res.data.user, token })
    } catch {
      localStorage.removeItem('token')
    }
  },
}))