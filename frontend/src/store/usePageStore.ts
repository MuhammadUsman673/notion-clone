import { create } from 'zustand'
import { Page } from '@/types'
import api from '@/lib/api'

interface PageStore {
  pages: Page[]
  currentPage: Page | null
  isLoading: boolean
  fetchPages: () => Promise<void>
  fetchPage: (id: string) => Promise<void>
  createPage: (parentId?: string) => Promise<Page>
  updatePage: (id: string, data: Partial<Page>) => Promise<void>
  deletePage: (id: string) => Promise<void>
}

export const usePageStore = create<PageStore>((set, get) => ({
  pages: [],
  currentPage: null,
  isLoading: false,

  fetchPages: async () => {
    set({ isLoading: true })
    const res = await api.get('/pages')
    set({ pages: res.data.pages, isLoading: false })
  },

  fetchPage: async (id) => {
    const res = await api.get(`/pages/${id}`)
    set({ currentPage: res.data.page })
  },

  createPage: async (parentId?) => {
    const res = await api.post('/pages', {
      title: 'Untitled',
      icon: '📄',
      parentId
    })
    const newPage = res.data.page
    set({ pages: [...get().pages, newPage] })
    return newPage
  },

  updatePage: async (id, data) => {
    await api.put(`/pages/${id}`, data)
    set({
      pages: get().pages.map((p) => (p.id === id ? { ...p, ...data } : p)),
      currentPage: get().currentPage?.id === id
        ? { ...get().currentPage!, ...data }
        : get().currentPage,
    })
  },

  deletePage: async (id) => {
    await api.delete(`/pages/${id}`)
    set({ pages: get().pages.filter((p) => p.id !== id) })
  },
}))