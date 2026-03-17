export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Page {
  id: string
  title: string
  icon: string
  cover?: string
  content: any
  userId: string
  parentId?: string
  children?: Page[]
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: User
}