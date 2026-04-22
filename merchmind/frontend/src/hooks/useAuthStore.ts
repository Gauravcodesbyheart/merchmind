import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'planner' | 'manager' | 'analyst' | 'finance' | 'admin'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// Demo users for hackathon demo
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'planner@merchmind.ai': {
    password: 'demo123',
    user: { id: '1', name: 'Priya Sharma', email: 'planner@merchmind.ai', role: 'planner' },
  },
  'manager@merchmind.ai': {
    password: 'demo123',
    user: { id: '2', name: 'Rahul Verma', email: 'manager@merchmind.ai', role: 'manager' },
  },
  'finance@merchmind.ai': {
    password: 'demo123',
    user: { id: '3', name: 'Ananya Das', email: 'finance@merchmind.ai', role: 'finance' },
  },
  'admin@merchmind.ai': {
    password: 'demo123',
    user: { id: '4', name: 'Admin User', email: 'admin@merchmind.ai', role: 'admin' },
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // In production: call POST /api/auth/login
        const match = DEMO_USERS[email]
        if (!match || match.password !== password) {
          throw new Error('Invalid credentials')
        }
        const token = btoa(JSON.stringify({ userId: match.user.id, exp: Date.now() + 86400000 }))
        set({ user: match.user, token, isAuthenticated: true })
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    { name: 'merchmind-auth' }
  )
)
