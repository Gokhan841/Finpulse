import { useQuery } from '@tanstack/react-query'
import { dashboardAPI } from '@/lib/api'

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardAPI.getFinancialSummary(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useWorkingCapital = () => {
  return useQuery({
    queryKey: ['dashboard', 'working-capital'],
    queryFn: () => dashboardAPI.getWorkingCapital(),
    staleTime: 5 * 60 * 1000,
  })
}

export const useRecentTransactions = () => {
  return useQuery({
    queryKey: ['dashboard', 'transactions'],
    queryFn: () => dashboardAPI.getRecentTransactions(),
    staleTime: 5 * 60 * 1000,
  })
}

export const useWalletCards = () => {
  return useQuery({
    queryKey: ['dashboard', 'wallet'],
    queryFn: () => dashboardAPI.getWalletCards(),
    staleTime: 5 * 60 * 1000,
  })
}

export const useScheduledTransfers = () => {
  return useQuery({
    queryKey: ['dashboard', 'transfers'],
    queryFn: () => dashboardAPI.getScheduledTransfers(),
    staleTime: 5 * 60 * 1000,
  })
}
