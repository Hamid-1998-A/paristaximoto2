'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap-config'

export default function Contact() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-info, .contact-form-wrapper',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: '.contact-wrapper', start: 'top 82%' } }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const form = ref.current?.querySelector<HTMLFormElement>('#contact-form')
    if (!form) return

    const handleSubmit = (e: Event) => {
      e.preventDefault()
      const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]')
      if (!btn) return
      const originalText = btn.textContent ?? ''
      btn.disabled = true
      btn.innerHTML = '<span class="spinner"></span> Envoi...'
      setTimeout(() => {
        btn.textContent = originalText
        btn.disabled = false
        const success = document.getElementById('form-success')
        if (success) {
          success.classList.add('visible')
          form.reset()
          setTimeout(() => success.classList.remove('visible'), 6000)
        }
      }, 1500)
    }
    form.addEventListener('submit', handleSubmit)
    return () => form.removeEventListener('submit', handleSubmit)
  }, [])

  return (
    <section ref={ref} className="section contact" id="contact">
      <div className="container">
        <div className="contact-wrapper">

          <div className="contact-info">
            <span className="sec-label" style={{ color: 'rgba(245,243,238,0.4)' }}>
              <b style={{ color: 'var(--color-signal)' }}>06</b> — Contact
            </span>
            <h2>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300 }}>Réservez en </span>
              <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>30 secondes.</em>
            </h2>
            <div className="contact-items">
              {[
                { icon: '📞', title: 'Téléphone', lines: [<a key="t" href="tel:+33611916560">06 11 91 65 60</a>, <span key="s" style={{ fontSize: '0.82rem', marginTop: 2, display: 'block' }}>Disponible 24h/24 — 7j/7</span>] },
                { icon: '💬', title: 'WhatsApp', lines: [<a key="w" href="https://wa.me/33611916560" target="_blank" rel="noopener">Envoyer un message</a>, <span key="r" style={{ fontSize: '0.82rem', marginTop: 2, display: 'block' }}>Réponse rapide garantie</span>] },
                { icon: '✉️', title: 'Email', lines: [<a key="e" href="mailto:contact@paristaximoto.fr">contact@paristaximoto.fr</a>, <span key="d" style={{ fontSize: '0.82rem', marginTop: 2, display: 'block' }}>Réponse sous 2h en journée</span>] },
                { icon: '📍', title: 'Zone d\'intervention', lines: ['Paris & Île-de-France', <span key="z" style={{ fontSize: '0.82rem', marginTop: 2, display: 'block' }}>CDG, Orly, grande couronne</span>] },
              ].map((item, i) => (
                <div className="contact-item" key={i}>
                  <div className="contact-item-icon">{item.icon}</div>
                  <div className="contact-item-content">
                    <h4>{item.title}</h4>
                    {item.lines.map((line, j) => <p key={j}>{line}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-form-wrapper">
            <h3>Envoyer un message</h3>
            <p>Pour devis entreprise, événement ou demande spéciale.</p>
            <form id="contact-form" className="contact-form" noValidate>
              <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                  <label htmlFor="contact-name">Prénom</label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input type="text" id="contact-name" placeholder="Jean" required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="contact-phone">Téléphone</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📱</span>
                    <input type="tel" id="contact-phone" placeholder="06 XX XX XX XX" />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input type="email" id="contact-email" placeholder="jean@exemple.fr" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="contact-subject">Objet</label>
                <select id="contact-subject">
                  <option value="">Choisir un objet...</option>
                  <option value="reservation">Réservation</option>
                  <option value="evenement">Événement / Mise à dispo</option>
                  <option value="devis">Devis entreprise</option>
                  <option value="info">Renseignement</option>
                  <option value="avis">Avis / retour</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" placeholder="Décrivez votre besoin..." required />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <span className="btn-bg" aria-hidden="true" />
                <span className="btn-label">Envoyer le message →</span>
              </button>
              <div id="form-success" className="form-success">
                ✓ Message envoyé ! Nous vous répondrons très bientôt.
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
