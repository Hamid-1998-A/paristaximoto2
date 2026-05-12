'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap-config'

export default function Footer() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const newsletterForm = ref.current?.querySelector<HTMLFormElement>('#newsletter-form')
    if (!newsletterForm) return
    const handleSubmit = (e: Event) => {
      e.preventDefault()
      const input = newsletterForm.querySelector<HTMLInputElement>('input')
      if (input?.value) {
        input.value = ''
        input.placeholder = 'Merci pour votre inscription !'
        setTimeout(() => { input.placeholder = 'Votre email...' }, 3000)
      }
    }
    newsletterForm.addEventListener('submit', handleSubmit)
    return () => newsletterForm.removeEventListener('submit', handleSubmit)
  }, [])

  return (
    <footer ref={ref}>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="navbar-brand" style={{ fontSize: '1.1rem' }}>
              <div className="logo-icon">
                <Image src="/logov2.png" alt="Paris TaxiMoto" width={32} height={32} style={{ objectFit: 'contain', borderRadius: '50%' }} />
              </div>
              Paris<span style={{ color: 'var(--color-signal)' }}>TaxiMoto</span>
            </div>
            <p>Service de moto-taxi professionnel à Paris et Île-de-France. Disponible 24h/24, certifié VMDTR, assurance passager incluse.</p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook">f</a>
              <a href="#" className="social-link" aria-label="Instagram">ig</a>
              <a href="#" className="social-link" aria-label="LinkedIn">in</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Navigation</h4>
            <ul className="footer-links">
              {['#services', '#calculateur', '#tarifs', '#faq', '#contact'].map(href => (
                <li key={href}><a href={href}>{href.replace('#', '').charAt(0).toUpperCase() + href.replace('#', '').slice(1)}</a></li>
              ))}
              <li><a href="/blog">Blog</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Services</h4>
            <ul className="footer-links">
              {['Transferts aéroport', 'Transferts gares', 'Trajets pro', 'Mise à disposition', 'Événements', 'Service nuit'].map(s => (
                <li key={s}><a href="#services">{s}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact direct</h4>
            <p style={{ fontSize: '0.88rem', marginBottom: 14, color: 'rgba(245,243,238,0.45)', fontFamily: 'var(--font-sans)' }}>
              Disponible 24h/24 pour votre réservation.
            </p>
            <a href="tel:+33611916560" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 10 }}>
              <span className="btn-bg" aria-hidden="true" />
              <span className="btn-label">📞 06 11 91 65 60</span>
            </a>
            <a href="https://wa.me/33611916560" target="_blank" rel="noopener" className="btn-wa" style={{ width: '100%', justifyContent: 'center' }}>
              <span className="btn-bg" aria-hidden="true" />
              <span className="btn-label">💬 WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Paris TaxiMoto. Tous droits réservés.</p>
          <ul className="footer-bottom-links">
            <li><a href="#">Mentions légales</a></li>
            <li><a href="#">Confidentialité</a></li>
            <li><a href="#">CGV</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
