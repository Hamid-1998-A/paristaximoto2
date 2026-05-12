'use client'
import React, { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap-config'

const SERVICES = [
  {
    id: 'sc-1', badge: 'CDG · Orly', icon: 'plane', name: 'Transferts\nAéroports',
    title: 'Transferts Aéroports',
    desc: 'CDG, Orly, Beauvais. Suivi de vols en temps réel, attente incluse en cas de retard.',
    feats: ['Charles de Gaulle (CDG)', 'Orly (ORY)', 'Suivi de vol automatique', 'Prise en charge bagage de cabine'],
  },
  {
    id: 'sc-2', badge: 'Paris', icon: 'train', name: 'Transferts\nGares',
    title: 'Transferts Gares',
    desc: 'Gare du Nord, Lyon, Montparnasse, Saint-Lazare, Est… Ponctualité garantie pour vos correspondances.',
    feats: ['Toutes gares parisiennes', 'Correspondance TGV / Eurostar', 'Confirmation par SMS', 'Chauffeur identifié'],
  },
  {
    id: 'sc-3', badge: 'Pro', icon: 'briefcase', name: 'Trajets\nProfessionnels',
    title: 'Trajets Professionnels',
    desc: 'Réunions, conférences, déplacements urgents. Factures disponibles, comptes entreprises acceptés.',
    feats: ['Facturation entreprise', 'Réservation à l\'avance', 'Ponctualité certifiée', 'Discrétion assurée'],
  },
  {
    id: 'sc-4', badge: 'Dispo', icon: 'timer', name: 'Mise à\nDisposition',
    title: 'Mise à Disposition',
    desc: 'Besoin d\'un chauffeur à votre disposition pour plusieurs heures ? Réunions, visites, journées chargées — nous restons avec vous.',
    feats: ['À la demi-journée ou journée', 'Plusieurs arrêts inclus', 'Tarif horaire négocié', 'Facturation entreprise'],
  },
  {
    id: 'sc-5', badge: 'VIP', icon: 'star', name: 'Événements\nSpéciaux',
    title: 'Événements Spéciaux',
    desc: 'Mariage, soirée privée, sortie VIP, tournage… Votre moto-taxi dédié pour tous vos événements spéciaux à Paris.',
    feats: ['Mariages & cérémonies', 'Soirées & événements privés', 'Shooting photo / tournage', 'Arrivée ou départ en moto'],
  },
  {
    id: 'sc-6', badge: '7j/7', icon: 'moon', name: 'Service Nuit\n& Weekend',
    title: 'Service Nuit & Weekend',
    desc: 'Disponible 24h/24 et 7j/7. Sorties, événements, retours tardifs — nous sommes là quand les autres ne le sont pas.',
    feats: ['Disponible de 20h à 7h', 'Samedis et dimanches', 'Jours fériés', 'Réservation en ligne'],
  },
]

const ICONS: Record<string, React.ReactElement> = {
  plane: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-2-5.5-.5L10 5 1.8 6.2c-1.3.2-1.5 1.7-.4 2.4L8 12l-2.6 2.6a.5.5 0 0 0 0 .7l2.3 2.3a.5.5 0 0 0 .7 0L11 15l3.4 6.6c.7 1.1 2.2.9 2.4-.4z"/></svg>,
  train: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16M12 3v8"/><path d="m8 19-2 3M18 22l-2-3M8 15h0M16 15h0"/></svg>,
  briefcase: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M12 12v4M10 14h4"/></svg>,
  timer: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2h4M12 14l3-3M12 6a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/></svg>,
  star: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  moon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>,
  chevronDown: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
}

function toggleSvc(id: string) {
  const card = document.getElementById(id)
  if (!card) return
  const isOpen = card.classList.contains('open')
  document.querySelectorAll('.svc-card.open').forEach(c => {
    c.classList.remove('open')
    c.querySelector('button')?.setAttribute('aria-expanded', 'false')
    c.querySelector('.svc-body')?.setAttribute('aria-hidden', 'true')
  })
  if (!isOpen) {
    card.classList.add('open')
    card.querySelector('button')?.setAttribute('aria-expanded', 'true')
    card.querySelector('.svc-body')?.setAttribute('aria-hidden', 'false')
  }
}

export default function Services() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.svc-card',
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: '.svc-grid', start: 'top 82%' } }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="section services" id="services">
      <div className="container">
        <div className="section-header">
          <span className="sec-label"><b>02</b> — Nos services</span>
          <h2>Là où vous devez être.</h2>
        </div>
        <div className="svc-scroll">
          <div className="svc-grid">
            {SERVICES.map(svc => (
              <article className="svc-card" id={svc.id} key={svc.id}>
                <button
                  className="svc-hd"
                  onClick={() => toggleSvc(svc.id)}
                  aria-expanded="false"
                  aria-controls={`sb-${svc.id.split('-')[1]}`}
                >
                  <span className="svc-badge">{svc.badge}</span>
                  <span className="svc-icon">{ICONS[svc.icon]}</span>
                  <span className="svc-name">{svc.name.replace('\n', '\n')}</span>
                  <span className="svc-chev">{ICONS.chevronDown}</span>
                </button>
                <div className="svc-body" id={`sb-${svc.id.split('-')[1]}`} aria-hidden="true">
                  <div className="svc-body-in">
                    <h4>{svc.title}</h4>
                    <p>{svc.desc}</p>
                    <ul className="svc-feats">
                      {svc.feats.map(f => <li key={f}>{f}</li>)}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
