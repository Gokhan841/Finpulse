import { Search, Bell, ChevronDown, Menu } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Avatar } from '@/components/ui/Avatar'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth()

  const displayName = user?.fullName || 'User'
  const avatarImage = user?.avatar ?? undefined

  return (
    <header className="pt-6 lg:pt-[30px] px-4 md:px-6 lg:px-[30px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6 text-brand-dark" />
          </button>
          
          <h1 className="text-xl md:text-2xl lg:text-[25px] font-semibold text-brand-dark">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-1 md:gap-4">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5 text-brand-gray" />
          </button>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5 text-brand-gray" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg transition-colors p-1 md:p-2"
          >
            <Avatar name={displayName} image={avatarImage} size={36} />
            <span className="hidden md:block text-[14px] font-semibold text-brand-dark">
              {displayName}
            </span>
            <ChevronDown className="hidden md:block w-4 h-4 text-brand-gray shrink-0" />
          </button>
        </div>
      </div>
    </header>
  )
}