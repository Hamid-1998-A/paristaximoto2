'use client'
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap-config'

export default function FloatingElements() {
  const cfRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Floating phone tooltip
    const floatingBtn = document.querySelector<HTMLElement>('.floating-phone-btn')
    const tooltip = document.querySelector<HTMLElement>('.floating-tooltip')
    const onEnter = () => tooltip?.classList.add('visible')
    const onLeave = () => tooltip?.classList.remove('visible')
    floatingBtn?.addEventListener('mouseenter', onEnter)
    floatingBtn?.addEventListener('mouseleave', onLeave)

    // FTB bounce animation on click
    const ftbCta = document.querySelector<HTMLElement>('.ftb-cta')
    const onFtbClick = () => {
      ftbCta?.classList.add('ftb-bouncing')
      setTimeout(() => ftbCta?.classList.remove('ftb-bouncing'), 600)
    }
    ftbCta?.addEventListener('click', onFtbClick)

    // FTB active link on scroll
    const sections = document.querySelectorAll<HTMLElement>('section[id]')
    const ftbItems = document.querySelectorAll<HTMLElement>('.ftb-item[data-section]')
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id')
          ftbItems.forEach(item => {
            item.classList.toggle('ftb-active', item.dataset.section === id)
          })
        }
      })
    }, { threshold: 0.35 })
    sections.forEach(s => sectionObserver.observe(s))

    // Save Contact Button
    let cfTimer: ReturnType<typeof setTimeout>
    const cf = cfRef.current
    if (cf) {
      const btn = cf.querySelector<HTMLButtonElement>('.cf-btn')
      const close = cf.querySelector<HTMLButtonElement>('.cf-close')

      const showCf = () => {
        cf.classList.add('cf-visible')
        cf.classList.remove('cf-out')
        cfTimer = setTimeout(() => {
          btn?.classList.add('cf-expanded')
          setTimeout(() => {
            btn?.classList.remove('cf-expanded')
            setTimeout(() => {
              cf.classList.add('cf-out')
              setTimeout(() => cf.classList.remove('cf-visible', 'cf-out'), 350)
            }, 2000)
          }, 2000)
        }, 800)
      }

      const scrollHandler = () => {
        if (window.scrollY > 300 && !cf.classList.contains('cf-visible')) showCf()
      }
      window.addEventListener('scroll', scrollHandler, { passive: true, once: true })

      btn?.addEventListener('click', () => {
        const vcard = [
          'BEGIN:VCARD', 'VERSION:3.0',
          'FN:Paris TaxiMoto', 'ORG:Paris TaxiMoto',
          'TEL;TYPE=CELL:+33611916560',
          'EMAIL:contact@paristaximoto.fr',
          'URL:https://paristaximoto.fr',
          'END:VCARD'
        ].join('\n')
        const blob = new Blob([vcard], { type: 'text/vcard' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = 'ParisTaxiMoto.vcf'; a.click()
        URL.revokeObjectURL(url)
      })

      close?.addEventListener('click', () => {
        clearTimeout(cfTimer)
        cf.classList.add('cf-out')
        setTimeout(() => cf.classList.remove('cf-visible', 'cf-out'), 350)
      })
    }

    return () => {
      floatingBtn?.removeEventListener('mouseenter', onEnter)
      floatingBtn?.removeEventListener('mouseleave', onLeave)
      ftbCta?.removeEventListener('click', onFtbClick)
      sectionObserver.disconnect()
      clearTimeout(cfTimer)
    }
  }, [])

  // GSAP entrance for floating elements
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.floating-phone',
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 1.2 }
      )
      gsap.fromTo('.ftb',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1 }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Floating Tab Bar */}
      <nav className="ftb" role="navigation" aria-label="Navigation rapide">
        <a href="/" className="ftb-item ftb-active" data-section="accueil">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="ftb-label">Accueil</span>
        </a>
        <a href="/resa" className="ftb-item ftb-cta">
          <div className="ftb-cta-circle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <span className="ftb-label">Réservation</span>
        </a>
        <a href="/blog" className="ftb-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span className="ftb-label">Actualités</span>
        </a>
      </nav>

      {/* Floating Buttons */}
      <div className="floating-phone">
        <a href="https://wa.me/33611916560" target="_blank" rel="noopener" className="floating-wa" aria-label="WhatsApp">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </a>
        <a href="tel:+33611916560" className="floating-phone-btn" aria-label="Appeler Paris TaxiMoto">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/></svg>
        </a>
      </div>

      {/* Save Contact Button */}
      <div ref={cfRef} className="cf-wrap">
        <button className="cf-btn" aria-label="Enregistrer le contact">
          <span className="cf-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          </span>
          <span className="cf-lbl">Enregistrer le contact</span>
        </button>
        <button className="cf-close" aria-label="Fermer">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </>
  )
}
