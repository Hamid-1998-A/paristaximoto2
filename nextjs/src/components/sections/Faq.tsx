'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap-config'

const FAQ_ITEMS = [
  {
    q: 'Comment réserver un moto-taxi à Paris ?',
    a: 'Appelez le 06 11 91 65 60 ou envoyez un message WhatsApp 24h/24. Vous pouvez aussi estimer votre tarif via notre calculateur puis réserver directement depuis l\'estimation. Confirmation par SMS garantie.',
  },
  {
    q: 'Quelle est la différence entre un moto-taxi et un VTC ?',
    a: 'Un moto-taxi (VMDTR) est un véhicule à deux roues motorisé avec chauffeur professionnel certifié. Il est jusqu\'à 3x plus rapide qu\'un VTC en heure de pointe car il circule entre les files de trafic. Idéal pour les trajets urgents à Paris.',
  },
  {
    q: 'Est-ce que le moto-taxi est sûr ?',
    a: 'Oui. Notre chauffeur est certifié VMDTR, titulaire d\'une carte professionnelle préfectorale. Casque homologué fourni, assurance responsabilité civile passager incluse. Votre sécurité est notre priorité absolue.',
  },
  {
    q: 'Peut-on transporter des bagages ?',
    a: 'Oui, nous acceptons un bagage de cabine (sac à dos ou trolley cabine jusqu\'à 10 kg) dans le top-case. Pour les bagages volumineux, prévenez-nous à la réservation et nous trouverons la meilleure solution.',
  },
  {
    q: 'Comment est calculé le prix d\'un trajet ?',
    a: 'Le tarif comprend une prise en charge (3,50€) + tarif kilométrique (1,80€/km le jour, 2,40€/km la nuit). Tarif minimum : 8€. Utilisez notre calculateur pour une estimation précise avec la carte interactive.',
  },
  {
    q: 'Proposez-vous la mise à disposition pour les événements ?',
    a: 'Absolument ! Mariage, soirée VIP, tournage, journée d\'entreprise… Nous proposons une mise à disposition à la demi-journée ou journée avec tarif horaire négocié. Contactez-nous pour un devis personnalisé.',
  },
  {
    q: 'Proposez-vous la facturation pour les entreprises ?',
    a: 'Oui. Comptes entreprises avec facturation mensuelle, tarifs négociés selon le volume, et reporting détaillé. Contactez-nous pour établir un devis personnalisé.',
  },
]

export default function Faq() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.faq-item',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: { trigger: '.faq-list', start: 'top 82%' } }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const handleClick = (e: Event) => {
      const btn = (e.target as Element).closest('.faq-question') as HTMLButtonElement | null
      if (!btn) return
      const item = btn.closest('.faq-item')
      if (!item) return
      const isOpen = item.classList.contains('open')
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'))
      if (!isOpen) item.classList.add('open')
    }
    const list = ref.current?.querySelector('.faq-list')
    list?.addEventListener('click', handleClick)
    return () => list?.removeEventListener('click', handleClick)
  }, [])

  return (
    <section ref={ref} className="section" id="faq">
      <div className="container">
        <div className="section-header section-header--center">
          <span className="sec-label"><b>05</b> — FAQ</span>
          <h2 className="anim-text">
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300 }}>Questions </span>
            <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>fréquentes</em>
          </h2>
        </div>
        <div className="faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <div className="faq-item" key={i}>
              <button className="faq-question">
                {item.q}
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
