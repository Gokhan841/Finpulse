import { useEffect, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { api } from '@/lib/api'

interface WalletCard {
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

// SVG Assets
const VisaLogo = () => (
  <svg width="32" height="21" viewBox="0 0 32 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M27.4306 11.7852H25.5139C25.6435 11.4479 25.9491 10.6322 26.4306 9.33789L26.4722 9.21484C26.5093 9.1237 26.5556 9.00521 26.6111 8.85938C26.6667 8.71354 26.7083 8.59505 26.7361 8.50391L26.9028 9.25586L27.4306 11.7852ZM7.375 10.8965L6.56944 6.86328C6.46759 6.37109 6.12037 6.125 5.52778 6.125H1.80556L1.77778 6.30273C4.65741 7.02279 6.52315 8.55404 7.375 10.8965ZM9.86111 6.125L7.61111 12.1133L7.375 10.8965C7.13426 10.2585 6.74074 9.66829 6.19444 9.12598C5.64815 8.58366 5.04167 8.18034 4.375 7.91602L6.25 14.8887H8.68056L12.3056 6.125H9.86111ZM11.7917 14.9023H14.0972L15.5417 6.125H13.2361L11.7917 14.9023ZM22.4583 6.34375C21.8194 6.09766 21.1296 5.97461 20.3889 5.97461C19.25 5.97461 18.3194 6.24349 17.5972 6.78125C16.875 7.31901 16.5093 8.01628 16.5 8.87305C16.4907 9.80273 17.162 10.5957 18.5139 11.252C18.9583 11.4616 19.2685 11.6484 19.4444 11.8125C19.6204 11.9766 19.7083 12.1543 19.7083 12.3457C19.7083 12.6191 19.5694 12.8288 19.2917 12.9746C19.0139 13.1204 18.6944 13.1934 18.3333 13.1934C17.537 13.1934 16.8148 13.043 16.1667 12.7422L15.8611 12.5918L15.5417 14.5605C16.2269 14.8704 17.0833 15.0254 18.1111 15.0254C19.3148 15.0345 20.2801 14.7656 21.0069 14.2188C21.7338 13.6719 22.1065 12.9427 22.125 12.0312C22.125 11.0651 21.4769 10.2721 20.1806 9.65234C19.7269 9.42448 19.3981 9.23307 19.1944 9.07812C18.9907 8.92318 18.8889 8.75 18.8889 8.55859C18.8889 8.35807 19.0023 8.18262 19.2292 8.03223C19.456 7.88184 19.7824 7.80664 20.2083 7.80664C20.8565 7.79753 21.4306 7.9069 21.9306 8.13477L22.1389 8.24414L22.4583 6.34375ZM28.3611 6.125H26.5833C25.9815 6.125 25.5787 6.37109 25.375 6.86328L21.9583 14.9023H24.375L24.8611 13.5898H27.8056C27.8519 13.7904 27.9444 14.2279 28.0833 14.9023H30.2222L28.3611 6.125ZM32 1.75V19.25C32 19.724 31.8241 20.1341 31.4722 20.4805C31.1204 20.8268 30.7037 21 30.2222 21H1.77778C1.2963 21 0.87963 20.8268 0.527778 20.4805C0.175926 20.1341 0 19.724 0 19.25V1.75C0 1.27604 0.175926 0.865885 0.527778 0.519531C0.87963 0.173177 1.2963 0 1.77778 0H30.2222C30.7037 0 31.1204 0.173177 31.4722 0.519531C31.8241 0.865885 32 1.27604 32 1.75Z" fill="#1A1F71" />
  </svg>
)

const MastercardLogo = () => (
  <svg width="47" height="36" viewBox="0 0 47 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="46" height="35" rx="3.5" fill="white" stroke="#E5E5E5" />
    <circle cx="17.5" cy="18" r="8.5" fill="#EB001B" />
    <circle cx="29.5" cy="18" r="8.5" fill="#F79E1B" />
    <path d="M23.5 11.5C25.7 13.3 27 16 27 19C27 22 25.7 24.7 23.5 26.5C21.3 24.7 20 22 20 19C20 16 21.3 13.3 23.5 11.5Z" fill="#FF5F00" />
  </svg>
)

const CardNetworkLogo = ({ network }: { network?: string }) => {
  const networkLower = network?.toLowerCase() || ''
  if (networkLower === 'mastercard') return <MastercardLogo />
  return <VisaLogo />
}

const WifiIcon = () => (
  <svg width="34" height="33" viewBox="0 0 34 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.2266 6.75129C21.93 12.6638 21.93 20.35 17.2266 26.2625M22.1567 2.75C28.7867 11.0825 28.7867 21.9175 22.1567 30.25M12.0558 9.33631C15.5125 13.6676 15.5125 19.3188 12.0558 23.65M6.87079 12.925C8.59912 15.0975 8.59912 17.9163 6.87079 20.0888" stroke="#363B41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChipIcon = ({ width = 38, height = 30 }: { width?: number; height?: number }) => (
  <svg width={width} height={height} viewBox="0 0 38 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M34.259 29.8716L3.79234 29.9999C1.77368 30.0116 0.105076 28.3547 0.0934075 26.336L6.12548e-05 3.82735C-0.0116073 1.80869 1.64533 0.140085 3.66399 0.128416L34.1306 6.12548e-05C36.1493 -0.0116073 37.8179 1.64533 37.8295 3.66399L37.9229 26.1727C37.9346 28.203 36.2776 29.8716 34.259 29.8716Z" fill="#B2AEA9" />
    <path d="M14.6565 25.9742C14.4931 25.9742 14.3414 25.8926 14.2597 25.7409C14.143 25.5308 14.2364 25.2625 14.4464 25.1458C15.0765 24.819 15.94 24.2006 16.4301 23.1504C17.0602 21.8086 16.8852 20.35 16.6168 20.2333C16.5468 20.1983 16.2901 20.3383 16.1267 20.42C15.7183 20.63 15.1465 20.9217 14.4814 20.7C13.828 20.4783 13.5129 19.9066 13.3613 19.6265C12.3578 17.8179 12.031 13.0921 13.0695 10.7351C13.4196 9.9533 13.8863 9.48655 14.4698 9.34653C15.0649 9.20651 15.5549 9.45155 15.9517 9.64992C16.2784 9.81327 16.4418 9.88328 16.5351 9.82494C16.9435 9.5799 16.9318 8.07466 16.3484 6.88446C15.8467 5.83429 14.9832 5.22753 14.3414 4.90081C14.1314 4.79579 14.038 4.52742 14.1547 4.31738C14.2597 4.10735 14.5281 4.01399 14.7381 4.13068C15.4966 4.51574 16.5234 5.23919 17.1302 6.51107C17.737 7.77127 18.0287 9.94162 16.9785 10.5834C16.4534 10.9101 15.94 10.6534 15.5433 10.4434C15.2399 10.2917 14.9482 10.14 14.6681 10.21C14.2831 10.3033 14.0147 10.7468 13.863 11.0968C12.9529 13.1505 13.2329 17.6195 14.1197 19.2065C14.2714 19.4748 14.4464 19.7666 14.7615 19.8716C15.0532 19.9766 15.3332 19.8482 15.73 19.6382C16.115 19.4398 16.5468 19.2181 17.0018 19.4398C17.982 19.9066 17.9237 22.0186 17.2236 23.5238C16.6285 24.8074 15.6016 25.5308 14.8432 25.9276C14.7965 25.9626 14.7265 25.9742 14.6565 25.9742Z" fill="#3D3D3C" />
    <path d="M13.2801 11.5287L5.39214 11.5637C5.1471 11.5637 4.94873 11.3654 4.94873 11.132C4.94873 10.8869 5.1471 10.6886 5.38047 10.6886L13.2684 10.6536C13.5135 10.6536 13.7118 10.8519 13.7118 11.0853C13.7235 11.3304 13.5251 11.5287 13.2801 11.5287Z" fill="#3D3D3C" />
    <path d="M13.3145 19.4167L5.42657 19.4517C5.18153 19.4517 4.98315 19.2534 4.98315 19.02C4.98315 18.775 5.18152 18.5766 5.41489 18.5766L13.3028 18.5416C13.5479 18.5416 13.7118 18.74 13.7462 18.9733C13.7462 19.2067 13.5595 19.4167 13.3145 19.4167Z" fill="#3D3D3C" />
    <path d="M23.8508 25.9396C23.7808 25.9396 23.7108 25.9279 23.6524 25.8929C22.894 25.5078 21.8671 24.7844 21.2604 23.5125C20.5369 22.0189 20.4669 19.9069 21.4471 19.4285C21.9021 19.2068 22.3339 19.4285 22.7189 19.6152C23.1157 19.8136 23.3957 19.9419 23.6874 19.8369C24.0142 19.7202 24.2008 19.3702 24.3175 19.1601C25.181 17.5615 25.426 13.0925 24.5042 11.0505C24.3409 10.7004 24.0725 10.257 23.6874 10.1753C23.4541 10.117 23.3024 9.88363 23.3607 9.65026C23.419 9.41689 23.6524 9.2652 23.8858 9.32354C24.4692 9.46357 24.9476 9.91863 25.2977 10.7004C26.3595 13.0458 26.0678 17.7716 25.0877 19.5919C24.936 19.8719 24.6209 20.4553 23.9791 20.677C23.314 20.9104 22.7423 20.6187 22.3339 20.4087C22.1705 20.327 21.9021 20.1986 21.8438 20.222C21.5754 20.3503 21.4237 21.8089 22.0655 23.1391C22.5672 24.1893 23.4307 24.7961 24.0725 25.1228C24.2825 25.2278 24.3759 25.4962 24.2592 25.7062C24.1658 25.8462 24.0142 25.9396 23.8508 25.9396Z" fill="#3D3D3C" />
    <path d="M22.0313 9.74339C21.8446 9.74339 21.6813 9.62671 21.6112 9.44002C20.6661 6.62789 22.8481 4.44587 23.5599 4.08414C23.7699 3.96746 24.0383 4.06081 24.155 4.27084C24.2717 4.48088 24.1783 4.74925 23.9683 4.86593C23.6532 5.02929 21.6463 6.76791 22.4514 9.15996C22.5331 9.39334 22.4047 9.63838 22.1713 9.72006C22.1247 9.73173 22.078 9.74339 22.0313 9.74339Z" fill="#3D3D3C" />
    <path d="M32.9883 11.4471L25.1004 11.4821C24.8554 11.4821 24.657 11.2838 24.657 11.0504C24.657 10.8053 24.8554 10.607 25.0887 10.607L32.9767 10.572C33.2217 10.572 33.4201 10.7703 33.4201 11.0037C33.4317 11.2487 33.2334 11.4471 32.9883 11.4471Z" fill="#3D3D3C" />
    <path d="M33.0228 19.3348L25.1348 19.3698C24.8898 19.3698 24.6914 19.1715 24.6914 18.9381C24.6914 18.6931 24.8898 18.4947 25.1231 18.4947L33.0111 18.4597C33.2561 18.4597 33.4545 18.6581 33.4545 18.8914C33.4662 19.1365 33.2678 19.3348 33.0228 19.3348Z" fill="#3D3D3C" />
  </svg>
)

const WalletCards = () => {
  const [cards, setCards] = useState<WalletCard[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await api.get('/financial/wallet')
        const veri = response as any;
        let gercekKartlar = veri.data?.data?.cards || veri.data?.cards || veri.data?.data || [];
        if (gercekKartlar.length > 0) setCards(gercekKartlar);
      } catch (error) {
        console.error('❌ API HATASI:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchWalletData()
  }, [])

  const formatExpiry = (m: number, y: number) => `${m.toString().padStart(2, '0')}/${y.toString().slice(-2)}`
  const parseBankName = (s: string) => {
    const parts = s?.split('|').map(x => x.trim()) || ['Fintech', 'Bank']
    return { primary: parts[0], secondary: parts[1] || 'Universal Bank' }
  }
  const formatCardNumber = (num: string, comp = false) => {
    const cleaned = num?.replace(/\s+/g, '') || '••••••••••••••••'
    return comp ? cleaned : (cleaned.match(/.{1,4}/g)?.join(' ') || cleaned)
  }
  const getCardBackground = (c: string) => {
    if (c === '#000000') return 'linear-gradient(104.3deg, #4A4A49 2.66%, #20201F 90.57%)'
    if (c === '#FFFFFF') return 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)'
    return c || '#000000'
  }

  if (isLoading) {
    return (
      <div className="w-full min-w-0 max-w-full relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-semibold text-brand-dark">Wallet</h2>
          <MoreHorizontal className="w-5 h-5 text-brand-gray" />
        </div>
        <div className="relative h-[322px] lg:h-[273px] xl:h-[322px] bg-gray-100 animate-pulse rounded-[15px]" />
      </div>
    )
  }

  return (
    <div className="w-full min-w-0 max-w-full relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-semibold text-brand-dark">Wallet</h2>
        <button className="p-1 hover:bg-gray-100 rounded-lg text-brand-gray">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="relative h-[322px] lg:h-[273px] xl:h-[322px] min-w-0">
        
        {/* Card 1 - Senin orijinal halini korudum */}
        <div
          className="relative z-10 w-full max-w-full h-[210px] lg:h-[178px] xl:h-[210px] rounded-[15px] shadow-2xl overflow-hidden"
          style={{ background: getCardBackground(cards[0]?.color) }}
        >
          <div className="absolute top-[18px] lg:top-[15px] xl:top-[18px] left-[30px] lg:left-[25px] xl:left-[30px] right-[30px] lg:right-[25px]">
            <div className="flex items-center gap-2">
              <p className="text-white text-[16px] lg:text-[14px] xl:text-[16px] font-normal truncate" style={{ fontFamily: 'Kumbh Sans, sans-serif' }}>
                {parseBankName(cards[0]?.bank || '').primary}
              </p>
              <div className="w-[1px] h-[14px] lg:h-[12px] xl:h-[14px]" style={{ background: 'rgba(255, 255, 255, 0.5)' }} />
              <p className="text-[#626260] text-[12px] lg:text-[11px] xl:text-[12px] font-medium truncate" style={{ fontFamily: 'Gordita, sans-serif' }}>
                {parseBankName(cards[0]?.bank || '').secondary}
              </p>
            </div>

            <div className="flex justify-between items-end mt-[32px] lg:mt-[27px] xl:mt-[32px]">
              <div className="lg:scale-90 xl:scale-100 origin-left">
                <ChipIcon />
              </div>
              <div className="lg:scale-80 xl:scale-100 origin-right">
                <WifiIcon />
              </div>
            </div>
          </div>

          <div className="absolute bottom-[58px] lg:bottom-[49px] xl:bottom-[58px] left-[30px] lg:left-[25px] right-[30px]">
            <p className="text-white text-[17px] lg:text-[15px] xl:text-[17px] font-bold tracking-[0.1em] truncate" style={{ fontFamily: 'Gordita, sans-serif' }}>
              {formatCardNumber(cards[0]?.cardNumber || '')}
            </p>
          </div>

          <div className="absolute bottom-[20px] lg:bottom-[17px] xl:bottom-[20px] left-[30px] lg:left-[25px] right-[30px] flex justify-between items-end">
            <p className="text-[#868685] text-[14px] lg:text-[12px] xl:text-[14px] font-medium" style={{ fontFamily: 'Gordita, sans-serif' }}>
              {cards[0] ? formatExpiry(cards[0].expiryMonth, cards[0].expiryYear) : '12/27'}
            </p>
            <div className="lg:scale-90 xl:scale-100 origin-bottom-right">
              <CardNetworkLogo network={cards[0]?.network} />
            </div>
          </div>
        </div>

        {/* Card 2 - Glass Card */}
        <div className="absolute z-20 top-[150px] lg:top-[127px] xl:top-[150px] left-[15px] right-[15px] h-[172px] lg:h-[146px] xl:h-[172px] overflow-hidden">
          <div className="absolute inset-0 rounded-[15px]" style={{ background: 'linear-gradient(131.66deg, #959595 -12.2%, #324000 147.88%)', opacity: 0.1 }} />
          <div className="absolute inset-0 rounded-[15px]" style={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '0.5px solid rgba(255, 255, 255, 0.3)' }} />

          <div className="relative h-full p-[20px] lg:p-[17px] xl:p-[20px] flex flex-col">
            {/* Header: Sadece Banka İsimleri */}
            <div className="flex items-center gap-2">
              <p className="text-white text-[16px] lg:text-[14px] xl:text-[16px] font-normal" style={{ fontFamily: 'Kumbh Sans, sans-serif' }}>
                {parseBankName(cards[1]?.bank || '').primary}
              </p>
              <div className="w-[1px] h-[14px] lg:h-[12px] xl:h-[14px]" style={{ background: 'rgba(255, 255, 255, 0.5)' }} />
              <p className="text-[#F5F5F5] text-[12px] lg:text-[11px] xl:text-[12px] font-medium leading-[100%] tracking-normal" style={{ fontFamily: 'Gordita, sans-serif' }}>
                {parseBankName(cards[1]?.bank || '').secondary}
              </p>
            </div>

            {/* Orta Bölüm: Çip ve Wifi İkonu Yan Yana (Aynı Seviyede) */}
            <div className="flex justify-between items-center mt-3 lg:mt-2.5 xl:mt-3">
              <div className="lg:scale-80 xl:scale-100 origin-left">
                <ChipIcon width={30} height={24} />
              </div>
              <div className="lg:scale-75 xl:scale-100 origin-right">
                <WifiIcon />
              </div>
            </div>

            {/* Alt Bölüm: Numara ve Logo */}
            <div className="mt-auto flex justify-between items-end">
              <div className="min-w-0">
                <p className="text-brand-dark text-[16px] lg:text-[14px] xl:text-[16px] font-bold leading-[100%] mb-1 truncate" style={{ fontFamily: 'Gordita, sans-serif', letterSpacing: '0.1em' }}>
                  {formatCardNumber(cards[1]?.cardNumber || '', true)}
                </p>
                <p className="text-brand-gray text-[12px] lg:text-[11px] xl:text-[12px] font-medium" style={{ fontFamily: 'Gordita, sans-serif' }}>
                  {cards[1] ? formatExpiry(cards[1].expiryMonth, cards[1].expiryYear) : '04/24'}
                </p>
              </div>
              <div className="lg:scale-90 xl:scale-100 origin-bottom-right">
                <CardNetworkLogo network={cards[1]?.network} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default WalletCards