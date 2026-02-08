import { useCurrencyStore } from '@/store/useCurrencyStore'

/**
 * Store'daki aktif para birimine göre sayıyı formatlar.
 * en-US locale, kuruş hanesi 0 (fractionDigits: 0).
 */
export function formatCurrency(value: number): string {
  const currency = useCurrencyStore.getState().currency
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Store'daki aktif para biriminin sembolünü döner (örn. $, €).
 * YAxis / label gibi yerlerde kullanmak için.
 */
export function getCurrencySymbol(): string {
  const currency = useCurrencyStore.getState().currency
  const parts = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).formatToParts(0)
  const part = parts.find((p) => p.type === 'currency')
  return part?.value ?? currency
}
