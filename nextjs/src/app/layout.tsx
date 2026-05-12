import type { Metadata } from 'next'
import { Space_Grotesk, DM_Serif_Display, Space_Mono } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: '400',
  style: ['normal', 'italic'],
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Paris TaxiMoto — Moto-Taxi Rapide & Fiable à Paris | Devis Instantané',
  description: 'Moto-taxi à Paris et Île-de-France. Trajets rapides, ponctualité garantie, disponible 24h/24. Calculez votre tarif en ligne. CDG, Orly, gares, événements.',
  keywords: 'moto taxi paris, taxi moto paris, moto taxi ile de france, moto taxi aeroport paris, vtc moto paris, moto taxi cdg, moto taxi orly',
  authors: [{ name: 'Paris TaxiMoto' }],
  openGraph: {
    title: 'Paris TaxiMoto — Moto-Taxi Rapide à Paris',
    description: 'Service de moto-taxi professionnel à Paris. Réservation rapide, tarifs transparents, chauffeur certifié VMDTR.',
    type: 'website',
  },
  icons: { icon: '/logov2.png', apple: '/logov2.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${spaceGrotesk.variable} ${dmSerif.variable} ${spaceMono.variable}`}
    >
      <head>
        <link rel="canonical" href="https://paristaximoto.fr/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Paris TaxiMoto',
              description: 'Service de moto-taxi professionnel à Paris et Île-de-France',
              telephone: '+33611916560',
              address: { '@type': 'PostalAddress', addressLocality: 'Paris', addressCountry: 'FR' },
              areaServed: 'Paris',
              priceRange: '€€',
              openingHours: 'Mo-Su 00:00-24:00',
            }),
          }}
        />
      </head>
      <body>
        {/* Noise overlay — élimine les aplats digitaux plats */}
        <svg
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0,
            width: '100%', height: '100%',
            pointerEvents: 'none',
            zIndex: 9999,
            opacity: 0.05,
          }}
        >
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves={3} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
        {children}
      </body>
    </html>
  )
}
