import { ReactNode } from 'react'

interface TagProps {
  children: ReactNode
  signal?: boolean
  className?: string
}

export default function Tag({ children, signal, className = '' }: TagProps) {
  return (
    <span className={`tag ${signal ? 'tag--signal' : ''} ${className}`}>
      {children}
    </span>
  )
}
