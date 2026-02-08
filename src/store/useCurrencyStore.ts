import { create } from 'zustand'

type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'TRY'

interface CurrencyState {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
}

/**
 * Merkezi para birimi store'u. AuthContext'ten bağımsız, sadece UI tercihi tutar.
 */
export const useCurrencyStore = create<CurrencyState>((set) => ({
  currency: 'USD',
  setCurrency: (currency) => set({ currency }),
}))
