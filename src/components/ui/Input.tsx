import { useState, InputHTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)

    return (
      <div className="w-full">
        {label && (
          <label className="block text-[14px] font-medium text-brand-dark mb-2">
            {label}
          </label>
        )}
        <motion.div
          className="origin-center"
          animate={{
            scale: isFocused ? 1.02 : 1,
            x: error ? [0, -8, 8, -8, 8, 0] : 0,
          }}
          transition={{
            scale: { duration: 0.2 },
            x: { duration: 0.4 },
          }}
        >
          <input
            className={cn(
              'flex h-[48px] w-full rounded-[10px] border border-[#F2F2F2] bg-white px-4 text-[14px] font-medium text-[#78778B] placeholder:text-[#78778B] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true)
              onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              onBlur?.(e)
            }}
            {...props}
          />
        </motion.div>
        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
