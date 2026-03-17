'use client'
import { useEffect } from 'react'
import { useThemeStore } from '@/store/useThemeStore'

export default function ThemeInitializer() {
  const { toggleTheme } = useThemeStore()

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
      useThemeStore.setState({ theme: 'light' })
    }
  }, [])

  return null
}