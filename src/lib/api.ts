import apiInstance from '@/config/api'
import { 
  FinancialSummaryResponse,
  WorkingCapitalResponse,
  RecentTransactionsResponse,
  WalletResponse,
  ScheduledTransfersResponse,
  // Component tipleri
  Transaction, 
  FinancialSummary, 
  WalletCard, 
  ScheduledTransfer,
  WorkingCapitalData 
} from '@/lib/types'

// =========================================================
// EXPORT API INSTANCE (AuthContext needs this)
// =========================================================
export const api = apiInstance

// =========================================================
// AUTH TYPES
// =========================================================
export interface User {
  id: string
  fullName: string
  email: string
  avatar?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  fullName: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    accessToken: string
    user: User
  }
} 

// =========================================================
// DASHBOARD API (Real API Endpoints)
// =========================================================
export const dashboardAPI = {
  
  // 1. Financial Summary
  getFinancialSummary: async (): Promise<FinancialSummary> => {
    const response = await api.get<FinancialSummaryResponse>('/financial/summary')
    return response.data.data 
  },

  // 2. Working Capital Chart
  getWorkingCapital: async (): Promise<WorkingCapitalData[]> => {
    const response = await api.get<WorkingCapitalResponse>('/financial/working-capital')
    return response.data.data.data 
  },

  // 3. Recent Transactions
  getRecentTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get<RecentTransactionsResponse>('/financial/transactions/recent')
    return response.data.data.transactions 
  },

  // 4. Wallet Cards (Fixed endpoint: /financial/wallet)
  getWalletCards: async (): Promise<WalletCard[]> => {
    const response = await api.get<WalletResponse>('/financial/wallet')
    return response.data.data.data
  },

  // 5. Scheduled Transfers
  getScheduledTransfers: async (): Promise<ScheduledTransfer[]> => {
    const response = await api.get<ScheduledTransfersResponse>('/financial/transfers/scheduled')
    return response.data.data.transfers
  }
}

// =========================================================
// AUTH API (Authentication endpoints)
// =========================================================
export const authAPI = {
  // Login user
  login: async (credentials: LoginData): Promise<{ token: string; user: User }> => {
    const response = await api.post<AuthResponse>('/users/login', credentials)
    
    // Extract accessToken and user from nested response
    const token = response.data?.data?.accessToken
    const user = response.data?.data?.user
    
    if (!token || !user) {
      throw new Error('Invalid response structure from server')
    }
    
    return { token, user }
  },
  
  // Register new user (then auto-login)
  register: async (data: RegisterData): Promise<{ token: string; user: User }> => {
    // Step 1: Register user
    await api.post('/users/register', data)
    
    // Step 2: Auto-login to get token
    const loginResponse = await api.post<AuthResponse>('/users/login', {
      email: data.email,
      password: data.password
    })
    
    const token = loginResponse.data?.data?.accessToken
    const user = loginResponse.data?.data?.user
    
    if (!token || !user) {
      throw new Error('Invalid response structure from server')
    }
    
    return { token, user }
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get<{ success: boolean; data: User }>('/users/profile')
    return response.data.data
  },

  // Logout (client-side only for now)
  logout: async (): Promise<void> => {
    // If backend logout endpoint exists, call it here
    // await api.post('/users/logout')
  }
}