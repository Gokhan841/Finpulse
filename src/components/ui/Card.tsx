import type { ReactNode } from 'react'

export interface CardProps {
  children?: ReactNode
  className?: string
  /** Override default padding: pt-[20px] pb-[20px] pl-[25px] pr-[19px] */
  padding?: string
}

const DEFAULT_PADDING = 'pt-[20px] pb-[20px] pl-[25px] pr-[19px]'

export function Card({ children, className = '', padding }: CardProps) {
  return (
    <div
      className={`w-full bg-white rounded-[25px] ${padding ?? DEFAULT_PADDING} ${className}`}
    >
      {children}
    </div>
  )
}
