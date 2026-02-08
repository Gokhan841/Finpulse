// ==========================================
// 1. API RESPONSE TİPLERİ (API'den dönen ana yapı)
// ==========================================

export interface FinancialSummaryResponse {
  data: {
    totalBalance: { 
      amount: number
      currency: string
      change: { percentage: number; trend: 'up' | 'down' }
    }
    totalExpense: { 
      amount: number
      currency: string
      change: { percentage: number; trend: 'up' | 'down' }
    }
    totalSavings: { 
      amount: number
      currency: string
      change: { percentage: number; trend: 'up' | 'down' }
    }
    lastUpdated: string
  }
}

export interface WorkingCapitalResponse {
  data: {
    period: string
    currency: string
    data: Array<{
      month: string
      income: number
      expense: number // Dikkat: expenses değil, expense
      net: number
    }>
    summary: {
      totalIncome: number
      totalExpense: number
      netBalance: number
    }
  }
}

export interface RecentTransactionsResponse {
  data: {
    transactions: Array<{
      id: string
      name: string
      business: string
      image: string
      amount: number
      date: string
      type: string
      status: string
    }>
  }
}

export interface WalletResponse {
  data: {
    data: Array<{
      id: string
      name: string
      type: string
      cardNumber: string
      bank: string
      network: string
      expiryMonth: number
      expiryYear: number
      color: string
      isDefault: boolean
    }>
  }
}

export interface ScheduledTransfersResponse {
  data: {
    transfers: Array<{
      id: string
      name: string
      image: string
      date: string
      amount: number
      currency: string
      status: string
    }>
  }
}

// ==========================================
// 2. BİLEŞEN TİPLERİ (Componentlerde kullandıklarımız)
// ==========================================

export interface FinancialSummary {
  totalBalance: { 
    amount: number
    currency: string
    change: { percentage: number; trend: 'up' | 'down' }
  }
  totalExpense: { 
    amount: number
    currency: string
    change: { percentage: number; trend: 'up' | 'down' }
  }
  totalSavings: { 
    amount: number
    currency: string
    change: { percentage: number; trend: 'up' | 'down' }
  }
  lastUpdated: string
}

export interface WorkingCapitalData {
  month: string
  income: number
  expense: number
  net: number
}

export interface Transaction {
  id: string
  name: string
  business: string
  image: string
  amount: number
  date: string
  type: string
  status: string
}

export interface WalletCard {
  id: string
  name: string
  type: string
  cardNumber: string
  bank: string
  network: string
  expiryMonth: number
  expiryYear: number
  color: string
  isDefault: boolean
}

export interface ScheduledTransfer {
  id: string
  name: string
  image: string
  date: string
  amount: number
  currency: string
  status: string
}