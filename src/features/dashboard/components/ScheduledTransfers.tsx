import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { useScheduledTransfers } from '../hooks/useDashboardData'
import type { ScheduledTransfer } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

const GreenArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.44238 5.5575L9.87738 9L6.44238 12.4425L7.49988 13.5L11.9999 9L7.49988 4.5L6.44238 5.5575Z" fill="#29A073"/>
  </svg>
)

function getCurrencySymbol(currency: string): string {
  try {
    const parts = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).formatToParts(0)
    const part = parts.find((p) => p.type === 'currency')
    return part?.value ?? currency
  } catch {
    return currency || '$'
  }
}

const TransferItem = ({ transfer, isLast, isCompact }: { transfer: ScheduledTransfer; isLast: boolean; isCompact: boolean }) => {
  const currencySymbol = getCurrencySymbol(transfer.currency)
  const dateObj = new Date(transfer.date)
  const formattedDate = format(dateObj, 'dd MMM yyyy')
  const formattedTime = format(dateObj, 'HH:mm')

  return (
    <div className={`flex items-center justify-between w-full min-w-0 py-3 ${!isLast ? 'border-b border-[#FAFAFA]' : ''} hover:bg-gray-50 transition-colors cursor-pointer gap-2`}>
      <div className="flex items-center gap-[15px] min-w-0 flex-1 overflow-hidden">
        <img
          src={transfer.image}
          alt={transfer.name}
          className={`${isCompact ? 'w-[30px] h-[30px]' : 'w-[33px] h-[33px]'} rounded-full object-cover shrink-0 transition-all`}
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(transfer.name)}&background=random`
          }}
        />
        <div className="flex flex-col gap-1 min-w-0 overflow-hidden">
          <p className={`${isCompact ? 'text-[13px]' : 'text-[14px]'} font-semibold text-brand-dark leading-none truncate transition-all`}>
            {transfer.name}
          </p>
          <p className={`${isCompact ? 'text-[11px]' : 'text-[12px]'} font-medium text-brand-gray leading-none truncate transition-all`}>
            {formattedDate} at {formattedTime}
          </p>
        </div>
      </div>
      <p className={`font-semibold ${isCompact ? 'text-[15px]' : 'text-[16px]'} text-brand-dark min-w-0 truncate text-right transition-all`}>
        -{currencySymbol}{Math.abs(transfer.amount).toFixed(2)}
      </p>
    </div>
  )
}

const ScheduledTransfers = () => {
  const { data, isLoading } = useScheduledTransfers()
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsCompact(width < 768 || (width >= 1024 && width < 1280))
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isLoading) {
    return <div className="w-full min-w-0 max-w-full bg-white rounded-[15px] p-6 animate-pulse h-[300px]" />
  }

  const displayedData = data?.slice(0, 5) || []
  if (displayedData.length === 0) return null

  return (
    <div 
      className="w-full min-w-0 bg-white rounded-[15px] flex flex-col transition-all duration-300
                 gap-4 min-[1440px]:gap-[25px] min-[1440px]:w-[354px]"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-brand-dark leading-none truncate
                       text-[16px] min-[480px]:text-[18px] lg:text-[16px] xl:text-[18px]">
          Scheduled Transfers
        </h2>
        <button className="text-[14px] text-brand-green hover:text-brand-green/80 font-semibold flex items-center shrink-0">
          <span className="hidden min-[360px]:inline">View All</span>
          <GreenArrowIcon />
        </button>
      </div>

      <div className="flex flex-col">
        <AnimatePresence initial={false}>
          {displayedData.map((transfer, index) => (
            <motion.div
              key={transfer.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              layout
            >
              <TransferItem 
                transfer={transfer} 
                isLast={index === displayedData.length - 1} 
                isCompact={isCompact}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ScheduledTransfers