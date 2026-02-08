import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { useRecentTransactions } from '../hooks/useDashboardData'
import type { Transaction } from '@/lib/types'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { motion, AnimatePresence } from 'framer-motion'

const TransactionRow = ({
  transaction,
  isLast,
  isMobile
}: {
  transaction: Transaction
  isLast: boolean
  isMobile: boolean
}) => {
  let formattedDate = transaction.date
  try {
    formattedDate = format(new Date(transaction.date), 'dd MMM yyyy')
  } catch (e) {
    console.error('Tarih formatlanamadı:', transaction.date)
  }

  if (isMobile) {
    return (
      <div className={`flex items-center justify-between py-4 ${!isLast ? 'border-b border-[#F5F5F5]' : ''}`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0 overflow-hidden rounded-[10px] bg-[#F5F7FA] flex items-center justify-center">
            <Avatar name={transaction.name} image={transaction.image} size={40} className="rounded-[10px]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-[14px] text-brand-dark truncate">{transaction.name}</span>
            <div className="flex items-center gap-2">
              <span className="font-normal text-[12px] text-brand-gray truncate">{transaction.business}</span>
              <span className="hidden sm:inline-block px-2 py-0.5 bg-gray-100 rounded text-[10px] text-brand-gray">
                {transaction.type}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className="font-semibold text-[14px] text-brand-dark">
            ${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <span className="font-medium text-[12px] text-brand-gray">{formattedDate}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`grid items-center ${
        isLast ? 'py-0 min-h-[40px]' : 'min-h-[53px] pb-[13px] mb-[15px] border-b border-[#F5F5F5]'
      }`}
      style={{ gridTemplateColumns: `267px 1fr` }}
    >
      <div className="flex items-center gap-[15px] min-w-0">
        <div className="w-[40px] h-[40px] shrink-0 overflow-hidden rounded-[10px] bg-[#F5F7FA] flex items-center justify-center">
          <Avatar name={transaction.name} image={transaction.image} size={40} className="rounded-[10px]" />
        </div>
        <div className="flex flex-col min-w-0 justify-center">
          <span className="font-medium text-[14px] leading-[100%] text-brand-dark truncate">{transaction.name}</span>
          <span className="font-normal text-[12px] leading-[100%] text-brand-gray truncate">{transaction.business}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 items-center text-center gap-4">
        <span className="font-medium text-[14px] text-brand-gray truncate">{transaction.type}</span>
        <span className="font-semibold text-[14px] text-brand-dark">
          ${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
        <span className="font-medium text-[14px] text-brand-gray">{formattedDate}</span>
      </div>
    </div>
  )
}

const RecentTransactions = () => {
  const { data, isLoading } = useRecentTransactions()
  const [showAll, setShowAll] = useState(false)
  
  
  const [useCompactMode, setUseCompactMode] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const isCompact = width < 768 || (width >= 1024 && width < 1280)
      setUseCompactMode(isCompact)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isLoading) return <Card className="w-full h-[400px] animate-pulse" />

  const displayedData = showAll ? data?.slice(0, 20) : data?.slice(0, 3)

  return (
    <Card className="w-full xl:max-w-[717px] flex flex-col p-5 md:p-6 lg:p-[30px]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-[16px] md:text-[18px] text-brand-dark">Recent Transaction</h2>
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1.5 text-brand-green hover:opacity-80 transition-opacity"
        >
          <span className="font-semibold text-[14px]">{showAll ? 'Show Less' : 'View All'}</span>
          <motion.svg 
            animate={{ rotate: showAll ? 270 : 90 }}
            width="18" height="18" viewBox="0 0 18 18"
          >
            <path d="M6.44238 5.5575L9.87738 9L6.44238 12.4425L7.49988 13.5L11.9999 9L7.49988 4.5L6.44238 5.5575Z" fill="currentColor" />
          </motion.svg>
        </button>
      </div>
      {!useCompactMode && (
        <div className="grid grid-cols-[267px_1fr] mb-4 text-brand-gray text-[12px]">
          <span>NAME/BUSINESS</span>
          <div className="grid grid-cols-3 text-center gap-4">
            <span>TYPE</span>
            <span>AMOUNT</span>
            <span>DATE</span>
          </div>
        </div>
      )}


      <div className="flex flex-col">
        <AnimatePresence initial={false} mode="popLayout">
          {displayedData?.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              layout
            >
              <TransactionRow
                transaction={transaction}
                isLast={index === (displayedData?.length ?? 0) - 1}
                isMobile={useCompactMode}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  )
}

export default RecentTransactions