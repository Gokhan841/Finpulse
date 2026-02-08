
import type { WalletCard } from '@/lib/types'
import BG from '@/assets/images/BG.svg'
import Effect from '@/assets/images/Effect.svg'
import chip0 from '@/assets/images/cip_0.svg'
import chip1 from '@/assets/images/cip_1.svg'
import wifi0 from '@/assets/images/wifi.3 1_0.svg'
import wifi1 from '@/assets/images/wifi.3 1_1.svg'

const maskCardNumber = (number: string) => {
  if (!number) return '**** **** **** ****'
  const cleaned = number.replace(/\s/g, '')
  if (cleaned.includes('*')) return number
  return `**** **** **** ${cleaned.slice(-4)}`
}

const formatExpiryDate = (month: number, year: number) => {
  return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`
}

const Card = ({ card }: { card: WalletCard }) => {
  const isDark = card.color?.toLowerCase().includes('dark') || card.color === '#1B212D'
  const bgImage = isDark ? BG : Effect
  const chipImage = isDark ? chip0 : chip1
  const wifiImage = isDark ? wifi0 : wifi1

  const bgColor = isDark ? 'bg-brand-dark' : 'bg-gradient-to-br from-gray-100 to-gray-200'
  const textColor = isDark ? 'text-white' : 'text-gray-900'
  return (
   
    <div
      className={`
        relative rounded-2xl overflow-hidden ${bgColor} ${textColor}
        w-full shrink-0 flex flex-col justify-between self-start min-h-0
        aspect-[1.58/1]
        p-3 lg:p-3 xl:p-6
      `}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0 truncate">
          <p className="text-[9px] lg:text-[10px] xl:text-xs font-medium mb-0.5">Fintech.</p>
          <p className="text-[8px] lg:text-[9px] xl:text-[10px] opacity-70 truncate">{card.bank || card.type}</p>
        </div>
        <img src={wifiImage} alt="Contactless" className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 shrink-0 object-contain" />
      </div>

      <div className="flex items-center">
        <img src={chipImage} alt="Chip" className="w-7 h-auto lg:w-8 xl:w-11 shrink-0 object-contain" />
      </div>

      <div className="space-y-1 lg:space-y-1.5 xl:space-y-4">
        <p className="font-semibold font-mono truncate text-xs lg:text-sm xl:text-lg tracking-tighter xl:tracking-wider">
          {maskCardNumber(card.cardNumber)}
        </p>

        <div className="flex items-end justify-between gap-1">
          <div className="min-w-0 truncate">
            <p className="text-[8px] lg:text-[9px] xl:text-[10px] opacity-70 leading-none mb-0.5">Fintech.</p>
            <p className="text-[8px] lg:text-[9px] xl:text-xs font-medium truncate">{card.bank || card.type}</p>
          </div>
          <div className="text-right shrink-0 flex flex-col items-end">
            <p className="text-[8px] lg:text-[9px] xl:text-[10px] opacity-70 leading-none mb-0.5">
              {formatExpiryDate(card.expiryMonth, card.expiryYear)}
            </p>
            <div className={`inline-block px-1.5 py-0.5 rounded-sm text-[7px] lg:text-[8px] xl:text-[10px] font-bold ${isDark ? 'bg-blue-600' : 'bg-blue-500'} text-white shrink-0`}>
              {card.network?.toUpperCase() || 'VISA'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}