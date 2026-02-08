import { ReactNode, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { motion, AnimatePresence } from 'framer-motion'

export interface DashboardLayoutProps {
  children?: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // Mobil menü durumu
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex overflow-hidden">
      
      {/* 1. MASAÜSTÜ SIDEBAR 
          GÜNCELLEME: lg (1024px) ekranlarda 230px, xl (1280px+) ekranlarda 250px.
          Bu değişiklik sağdaki Header ve İçeriğin sola kaymasını sağlar.
      */}
      <aside className={`
        hidden lg:block 
        shrink-0 border-r border-[#F5F5F5] transition-all duration-300
        lg:w-[230px] 
        xl:w-[250px]
      `}>
        <Sidebar />
      </aside>

      {/* 2. MOBİL SIDEBAR (Drawer) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-[40] lg:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              /* Mobil çekmeceyi de 230px yaparak tutarlı hale getirdik */
              className="fixed left-0 top-0 h-full w-[200px] bg-white z-[50] lg:hidden"
            >
              <Sidebar isMobile onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. ANA İÇERİK ALANI */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          {/* İçerik Sınırlayıcı */}
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-[25px] py-6">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout