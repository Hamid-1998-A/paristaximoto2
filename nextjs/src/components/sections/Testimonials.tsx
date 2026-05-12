'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap-config'

const TESTIMONIALS = [
  {
    text: '"Pris en charge en 5 minutes, arrivé à CDG avec 20 minutes d\'avance. Chauffeur professionnel, équipement nickel. Je recommande à 100% !"',
    name: 'Marc D.', role: 'Cadre commercial', initial: 'M',
  },
  {
    text: '"Trajet Gare du Nord → bureau en 8 minutes un lundi matin. En taxi classique ça m\'aurait pris 40 min. Bluffant."',
    name: 'Sophie L.', role: 'Avocate, Paris 8e', initial: 'S',
  },
  {
    text: '"Mise à disposition pour mon mariage — chauffeur impeccable, ponctuel, à l\'écoute. Une belle expérience pour une journée inoubliable."',
    name: 'Laura M.', role: 'Mariée, Paris 16e', initial: 'L',
  },
]

const Stars = () => (
  <div className="testimonial-stars">
    {'★★★★★'}
  </div>
)

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.testimonial-card',
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: '.testimonials-grid', start: 'top 82%' } }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="section testimonials" id="avis">
      <div className="container">
        <div className="section-header">
          <span className="sec-label"><b>04</b> — Avis clients</span>
          <div className="testi-score">4,9<span>/5</span></div>
          <div className="testi-score-sub">
            ★★★★★ · +1 200 avis vérifiés
          </div>
        </div>
        <div className="testi-scroll">
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <Stars />
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initial}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
