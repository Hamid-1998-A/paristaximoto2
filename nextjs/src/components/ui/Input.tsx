'use client'
import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: string
}

export default function Input({ icon, className = '', ...props }: InputProps) {
  return (
    <div className="input-wrapper">
      {icon && <span className="input-icon">{icon}</span>}
      <input className={`input ${className}`} {...props} />
    </div>
  )
}
