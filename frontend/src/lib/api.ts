import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth interceptor
api.interceptors.request.use(async (config) => {
  // Get token from Clerk if available
  const token = typeof window !== 'undefined' 
    ? await (window as any).__clerk?.session?.getToken() 
    : null
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// API services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/v1/auth/login', { email, password })
    return response.data
  },

  register: async (email: string, password: string, full_name?: string) => {
    const response = await api.post('/api/v1/auth/register', { email, password, full_name })
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/v1/auth/me')
    return response.data
  },

  updateProfile: async (data: { full_name?: string; avatar_url?: string }) => {
    const response = await api.put('/api/v1/auth/me', data)
    return response.data
  },

  changePassword: async (current_password: string, new_password: string) => {
    const response = await api.post('/api/v1/auth/change-password', {
      current_password,
      new_password
    })
    return response.data
  },

  updatePreferences: async (data: { email_notifications?: boolean; two_factor_enabled?: boolean }) => {
    const response = await api.patch('/api/v1/auth/preferences', data)
    return response.data
  },

  deleteAccount: async () => {
    const response = await api.delete('/api/v1/auth/me')
    return response.data
  },
}

export const teamService = {
  getMembers: async () => {
    const response = await api.get('/api/v1/team/members')
    return response.data
  },

  inviteMember: async (email: string, role: string = 'member') => {
    const response = await api.post('/api/v1/team/invite', { email, role })
    return response.data
  },

  updateMemberRole: async (memberId: number, role: string) => {
    const response = await api.patch(`/api/v1/team/members/${memberId}/role`, { role })
    return response.data
  },

  removeMember: async (memberId: number) => {
    const response = await api.delete(`/api/v1/team/members/${memberId}`)
    return response.data
  },
}

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/api/v1/dashboard/stats')
    return response.data
  },
  
  getActivity: async () => {
    const response = await api.get('/api/v1/dashboard/activity')
    return response.data
  },
}

export const subscriptionService = {
  createCheckoutSession: async (price_id: string, success_url: string, cancel_url: string) => {
    const response = await api.post('/api/v1/subscriptions/create-checkout-session', {
      price_id,
      success_url,
      cancel_url,
    })
    return response.data
  },
  
  createPortalSession: async () => {
    const response = await api.post('/api/v1/subscriptions/create-portal-session')
    return response.data
  },
}
