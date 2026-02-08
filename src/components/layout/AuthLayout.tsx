import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import logo from '@/assets/images/Logo.svg'
import authBanner from '@/assets/images/auth-banner.svg'

interface AuthLayoutProps {
  children: ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-white flex min-h-screen">
      <div className="flex-1 flex flex-col relative h-full">
        <motion.div
          className="absolute top-[40px] left-8 lg:left-[135px] shrink-0 z-10"
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <img src={logo} alt="Fintech" className="w-[108px] h-[30px]" />
        </motion.div>
        <div className="flex-1 flex items-center lg:pl-[135px] px-6 overflow-y-auto no-scrollbar pt-[100px] pb-10">
          <div className="w-full max-w-[404px] mx-auto lg:mx-0">
            {children}
          </div>
        </div>
      </div>
      <div className="hidden lg:block w-[675px] h-full relative shrink-0 overflow-hidden">
        <motion.img
          src={authBanner}
          alt="Authentication Banner"
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.1,
            y: [0, -15, 0],
          }}
          transition={{
            opacity: { duration: 0.6, ease: 'easeOut' },
            y: { repeat: Infinity, duration: 5, ease: 'easeInOut' },
          }}
        />
      </div>
    </div>
  )
}

export default AuthLayout