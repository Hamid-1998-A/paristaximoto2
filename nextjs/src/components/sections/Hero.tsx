'use client'
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap-config'
import { animateCounter } from '@/lib/utils'

export default function Hero() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-content .anim-text',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.5 }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll<HTMLElement>('.stat-number[data-target]').forEach(el => {
            const target = parseInt(el.dataset.target ?? '0')
            const suffix = el.dataset.suffix ?? ''
            animateCounter(el, target, suffix)
          })
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.5 })

    const stats = ref.current?.querySelector('.hero-stats')
    if (stats) observer.observe(stats)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="hero" id="accueil">
      <div className="hero-bg" role="img" aria-label="Vue aérienne de Paris" />
      <div className="hero-overlay" />
      <div className="container" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="hero-content">
          <div className="hero-badge anim-text">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="1"/><path d="M13 16l2 2 4-4"/></svg>
            Paris · 24h/24 · 7j/7
          </div>
          <h1 className="anim-text">
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
              Ne laissez pas<br />le trafic{' '}
            </span>
            <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>vous retarder.</em>
          </h1>
          <div className="hero-actions anim-text">
            <a href="/resa" className="btn-primary">
              <span className="btn-bg" aria-hidden="true" />
              <span className="btn-label">Réserver une course →</span>
            </a>
          </div>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="stat-number" data-target="4" data-suffix=".9★">0★</div>
            <div className="stat-label">Satisfaction</div>
          </div>
        </div>
      </div>
      <div className="hero-scroll" aria-hidden="true">Défiler</div>
    </section>
  )
}
