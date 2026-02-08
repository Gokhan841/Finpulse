import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import logo from '@/assets/images/Logo.svg'
import { X } from 'lucide-react' // Kapatma ikonu için

// Seçtiğin Yeni İkonlar
import { MdLiveHelp } from "react-icons/md";
import { RiHome5Fill } from "react-icons/ri";
import { IoWallet, IoLogOut } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import { PiReceiptFill } from "react-icons/pi";
import { HiPresentationChartLine } from "react-icons/hi2";

export interface NavItem {
  name: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  href: string
}

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: RiHome5Fill, href: '/dashboard' },
  { name: 'Transactions', icon: HiPresentationChartLine, href: '/transactions' },
  { name: 'Invoices', icon: PiReceiptFill, href: '/invoices' },
  { name: 'My Wallets', icon: IoWallet, href: '/wallets' },
  { name: 'Settings', icon: IoIosSettings, href: '/settings' },
]

// Prop tanımları
interface SidebarProps {
  isMobile?: boolean
  onClose?: () => void
}

export function Sidebar({ isMobile, onClose }: SidebarProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Linke tıklandığında eğer mobildeysek menüyü kapat
  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  return (
    <aside
className={`
  w-[200px] min-w-[200px]
  lg:w-[230px] lg:min-w-[230px] lg:px-[15px]
  xl:w-[250px] xl:min-w-[250px] xl:px-[25px]
  h-full
  bg-[#FAFAFA]
  flex flex-col
  pt-[30px] pb-[40px]
  px-[10px]
  overflow-hidden
  border-r border-[#F3F3F3]
`}      style={{ fontFamily: 'Kumbh Sans' }}
    >
      {/* Logo ve Kapatma Butonu */}
      <div className="mb-[30px] flex-shrink-0 flex items-center justify-between">
        <img src={logo} alt="Logo" className="h-[30px]" />
        {isMobile && (
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-md transition-colors lg:hidden"
          >
            <X size={24} className="text-brand-dark" />
          </button>
        )}
      </div>

      {/* İçerik Alanı */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar">
        
        {/* Üst Navigasyon */}
        <nav className="flex flex-col gap-[8px]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon
            return (
              <Link
              key={item.name}
              to={item.href}
              onClick={handleLinkClick}
              className={`w-full h-[48px] rounded-[8px] flex items-center gap-[12px] py-[14px] pl-[15px] transition-all duration-200 outline-none focus:outline-none ${
                isActive
                  ? 'bg-brand-lime text-brand-dark'
                  : 'text-brand-gray hover:bg-gray-100'
              }`}
            >
                <div className="w-[20px] h-[20px] flex items-center justify-center shrink-0">
                  <Icon 
                    size={20} 
                    className={isActive ? 'text-brand-dark' : 'text-brand-gray'} 
                  />
                </div>
                <span className="text-[14px] font-medium leading-none whitespace-nowrap">
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Alt Grup */}
        <div className="flex flex-col gap-[8px] mt-auto">
          <button
            type="button"
            className="w-full h-[48px] rounded-[8px] flex items-center gap-[12px] py-[14px] pl-[15px] text-brand-gray hover:bg-gray-100 hover:text-brand-dark transition-all text-left"
          >
            <div className="w-[20px] h-[20px] flex items-center justify-center shrink-0">
              <MdLiveHelp size={20} />
            </div>
            <span className="text-[14px] font-medium">Help</span>
          </button>
          
          <button
            type="button"
            onClick={handleLogout}
            className="w-full h-[48px] rounded-[8px] flex items-center gap-[12px] py-[14px] pl-[15px] text-brand-gray hover:bg-red-50 hover:text-red-600 transition-all text-left"
          >
            <div className="w-[20px] h-[20px] flex items-center justify-center shrink-0">
              <IoLogOut size={20} />
            </div>
            <span className="text-[14px] font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}