'use client'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'signal' | 'wa'
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  style?: React.CSSProperties
  id?: string
  target?: string
  rel?: string
  className?: string
}

export default function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  type = 'button',
  disabled,
  style,
  id,
  target,
  rel,
  className = '',
}: ButtonProps) {
  const cls = `btn-${variant} ${className}`
  const content = (
    <>
      <span className="btn-bg" aria-hidden="true" />
      <span className="btn-label">{children}</span>
    </>
  )

  if (href) {
    return (
      <a href={href} className={cls} style={style} id={id} target={target} rel={rel}>
        {content}
      </a>
    )
  }
  return (
    <button className={cls} onClick={onClick} type={type} disabled={disabled} style={style} id={id}>
      {content}
    </button>
  )
}
