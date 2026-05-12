'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap-config'

const ROWS = [
  { from: 'Paris', to: 'Paris', price: '€46' },
  { from: 'Paris', to: 'Aéroport Orly', price: '€76' },
  { from: 'Paris', to: 'CDG (Roissy)', price: '€99' },
  { from: 'La Défense', to: 'CDG (Roissy)', price: '€99' },
  { from: 'La Défense', to: 'Aéroport Orly', price: '€99' },
  { from: 'Aéroport CDG', to: 'Aéroport Orly', price: '€139' },
]

export default function Tarifs() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.tarif-table-wrap',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: '.tarif-table-wrap', start: 'top 82%' } }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="section" id="tarifs">
      <div className="container">
        <span className="sec-label anim-text"><b>03</b> — Tarifs</span>
        <h2 className="anim-text" style={{ marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300 }}>Grille tarifaire,<br /></span>
          <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>annoncée avant départ.</em>
        </h2>
        <p className="anim-text" style={{ color: 'var(--color-ink-60)', fontSize: '0.92rem' }}>
          Forfait inclus : casque, gants, blouson.
        </p>
        <div className="tarif-table-wrap">
          <table className="tarif-table">
            <thead>
              <tr>
                <th>Départ</th>
                <th>Arrivée</th>
                <th>Prix</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i}>
                  <td>{r.from}</td>
                  <td>{r.to}</td>
                  <td>{r.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <span className="tarif-note">
          * Tarifs TTC — majoration nuit (20h–7h) et week-end : +33% ·{' '}
          <a href="#estimer" style={{ color: 'var(--color-signal)', fontWeight: 600 }}>
            Estimez votre trajet →
          </a>
        </span>
      </div>
    </section>
  )
}
