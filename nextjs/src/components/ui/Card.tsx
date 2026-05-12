import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  accent?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function Card({ children, accent, className = '', style }: CardProps) {
  return (
    <div className={`card anim-card ${accent ? 'card--accent' : ''} ${className}`} style={style}>
      {children}
    </div>
  )
}
