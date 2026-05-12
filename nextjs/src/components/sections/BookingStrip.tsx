'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap-config'

export default function BookingStrip() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.anim-strip',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: { trigger: '.booking-strip', start: 'top 82%' } }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="booking-strip">
      <div className="container">
        <div className="booking-strip-info anim-strip">
          <h3>Disponible maintenant</h3>
          <p>Réservation en 30 secondes · Confirmation immédiate</p>
        </div>
        <div className="booking-strip-contact anim-strip">
          <div className="booking-strip-phone">
            <div className="phone-icon">📞</div>
            <a href="tel:+33611916560">06 11 91 65 60</a>
          </div>
          <a href="https://wa.me/33611916560" target="_blank" rel="noopener" className="btn-wa">
            <span className="btn-bg" aria-hidden="true" />
            <span className="btn-label">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  )
}
