import { useState, useEffect } from 'react'
import { useSpring, useTransform, useMotionValueEvent, motion } from 'framer-motion'
import { useDashboardSummary } from '../hooks/useDashboardData'
import { IoMdWallet } from "react-icons/io";
import { MdSavings } from "react-icons/md";

const formatAmount = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(value)

const springConfig = { stiffness: 100, damping: 30 }

function AnimatedAmount({ amount }: { amount: number }) {
  const spring = useSpring(0, springConfig)
  const display = useTransform(spring, formatAmount)
  const [displayValue, setDisplayValue] = useState(() => formatAmount(0))

  useMotionValueEvent(display, 'change', (v) => setDisplayValue(v))

  useEffect(() => {
    spring.set(amount)
  }, [amount, spring])

  return <motion.span>{displayValue}</motion.span>
}

interface StatCardProps {
  title: string
  amount: number
  currency: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  theme: 'on' | 'off'
}

const StatCard = ({ title, amount, icon: Icon, theme }: StatCardProps) => {
  const currencySymbol = '₺';

  const cardBg = theme === 'on' ? 'bg-[#363A3F]' : 'bg-[#F8F8F8]'
  const circleBg = theme === 'on' ? 'bg-[#4E5257]' : 'bg-[#EBE8E8]'
  const iconColor = theme === 'on' ? 'text-brand-lime' : 'text-[#363A3F]'
  const textColor = theme === 'on' ? 'text-white' : 'text-brand-dark'
  const labelColor = 'text-brand-gray'

  return (
    <div
      className={`
        ${cardBg} rounded-[10px] w-full min-w-0 flex items-center shrink-0
        p-3 gap-[16px] sm:gap-2 min-h-[85px]
        sm:max-w-[190px]
        md:max-w-[212px] md:ml-0 md:mr-auto 
        lg:max-w-full
        lg:p-4 lg:gap-2.5 lg:min-h-[95px]
        min-[1150px]:p-5 min-[1150px]:gap-3 min-[1150px]:min-h-[100px]
        min-[1440px]:py-6 min-[1440px]:pl-6 min-[1440px]:pr-4 min-[1440px]:gap-[12px] min-[1440px]:min-h-[105px]
      `}
    >
      <div
        className={`
          ${circleBg} rounded-full flex items-center justify-center shrink-0
          w-9 h-9
          md:w-[42px] md:h-[42px]
          lg:w-10 lg:h-10
          min-[1150px]:w-[38px] min-[1150px]:h-[38px]
          min-[1280px]:w-[34px] min-[1280px]:h-[34px]
          min-[1440px]:w-[42px] min-[1440px]:h-[42px]
        `}
      >
        <span className="flex items-center justify-center md:scale-100 lg:scale-95 min-[1150px]:scale-90 min-[1440px]:scale-100 origin-center">
          <Icon size={20} className={iconColor} />
        </span>
      </div>

      <div className="flex flex-col gap-2 min-[1440px]:gap-[10px] justify-center min-w-0 flex-1 overflow-hidden">
        <p
          className={`
            text-xs font-normal leading-tight ${labelColor} truncate
            md:text-[14px]
            lg:text-[13px]
            min-[1150px]:text-[14px]
          `}
        >
          {title}
        </p>
        <p
          className={`
            font-bold leading-tight ${textColor} whitespace-nowrap
            text-sm md:text-[24px]
            lg:text-base
            min-[1150px]:text-[18px]
            min-[1280px]:text-[17px]
            min-[1440px]:text-[22px] min-[1440px]:tracking-tighter
          `}
        >
          {currencySymbol}<AnimatedAmount amount={amount} />
        </p>
      </div>
    </div>
  )
}

const StatsGroup = () => {
  const { data, isLoading } = useDashboardSummary()

  const gridClasses = `
    grid gap-4 w-full min-w-0 [&>*]:min-w-0
    grid-cols-1
    min-[360px]:grid-cols-2
    min-[510px]:grid-cols-3
    sm:grid-cols-3
    lg:grid-cols-2
    min-[1230px]:grid-cols-3
    min-[1150px]:gap-[25px]
  `;

  if (isLoading) {
    return (
      <div className={gridClasses}>
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="h-[85px] lg:h-[95px] min-[1150px]:h-[100px] min-[1440px]:h-[105px] bg-gray-200 rounded-[10px] animate-pulse w-full sm:max-w-[190px] md:max-w-[212px] md:ml-0" 
          />
        ))}
      </div>
    )
  }

  if (!data) return null

  return (
    <div className={gridClasses}>
      <StatCard
        title="Total balance"
        amount={data.totalBalance?.amount || 0}
        currency="TRY"
        icon={IoMdWallet}
        theme="on"
      />
      
      <StatCard
        title="Total expense"
        amount={data.totalExpense?.amount || 0}
        currency="TRY"
        icon={IoMdWallet}
        theme="off"
      />
      
      <StatCard
        title="Total savings"
        amount={data.totalSavings?.amount || 0}
        currency="TRY"
        icon={MdSavings}
        theme="off"
      />
    </div>
  )
}

export default StatsGroup