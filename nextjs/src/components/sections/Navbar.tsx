'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap-config'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.navbar-brand, .navbar-nav li',
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06, delay: 0.2 }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const links = [
    { href: '#services', label: 'Services' },
    { href: '#calculateur', label: 'Calculateur' },
    { href: '#tarifs', label: 'Tarifs' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contact', label: 'Contact' },
    { href: '/blog', label: 'Blog' },
  ]

  return (
    <nav ref={ref} className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Navigation principale">
      <div className="container">
        <a href="#accueil" className="navbar-brand">
          <div className="logo-icon">
            <Image src="/logov2.png" alt="Paris TaxiMoto" width={32} height={32} style={{ objectFit: 'contain', borderRadius: '50%' }} />
          </div>
          Paris<span style={{ color: 'var(--color-signal)' }}>TaxiMoto</span>
        </a>

        <ul className={`navbar-nav${menuOpen ? ' open' : ''}`}>
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} onClick={closeMenu}>{l.label}</a>
            </li>
          ))}
          <li>
            <a href="tel:+33611916560" className="navbar-cta" onClick={closeMenu}>
              Réserver
            </a>
          </li>
        </ul>

        <button
          className="navbar-toggle"
          aria-label="Ouvrir le menu"
          onClick={() => setMenuOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
