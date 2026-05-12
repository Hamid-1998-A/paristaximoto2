'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap-config'
import { isNightRate } from '@/lib/utils'

const TARIFF = {
  baseFare: 3.50,
  ratePerKmDay: 1.80,
  ratePerKmNight: 2.40,
  minimumFare: 8,
  minimumFareGlobal: 47,
}

declare global {
  interface Window {
    initMapsCalculator: () => void
    triggerCalculate: () => void
    google: typeof google
    _lastEstimate?: {
      origin: string; destination: string; distance: string; duration: string;
      priceLow: number; priceHigh: number; period: string;
    }
  }
}

export default function Calculator() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.calculator-form',
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: '.calculator', start: 'top 82%' } }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    let map: google.maps.Map | null = null
    let directionsService: google.maps.DirectionsService | null = null
    let directionsRenderer: google.maps.DirectionsRenderer | null = null
    let originAutocomplete: google.maps.places.Autocomplete | null = null
    let destAutocomplete: google.maps.places.Autocomplete | null = null
    let originPlace: google.maps.places.PlaceResult | null = null
    let destPlace: google.maps.places.PlaceResult | null = null

    function checkAndCalculate() {
      if (originPlace?.geometry && destPlace?.geometry) calculateRoute()
    }

    function displayEstimate(
      distanceKm: number, _dMin: number, _dTrafficMin: number,
      distanceText: string, durationText: string
    ) {
      const night = isNightRate()
      const rateKm = night ? TARIFF.ratePerKmNight : TARIFF.ratePerKmDay
      let price = TARIFF.baseFare + distanceKm * rateKm
      price = Math.max(price, TARIFF.minimumFare)
      const priceLow = Math.round(price * 0.9)
      const priceHigh = Math.round(price * 1.1)

      window._lastEstimate = {
        origin: (originPlace as any)?.formatted_address || (document.getElementById('origin') as HTMLInputElement)?.value || '',
        destination: (destPlace as any)?.formatted_address || (document.getElementById('destination') as HTMLInputElement)?.value || '',
        distance: distanceText, duration: durationText, priceLow, priceHigh,
        period: night ? 'Tarif nuit' : 'Tarif jour',
      }

      const set = (id: string, val: string) => { const el = document.getElementById(id); if (el) el.textContent = val }
      set('est-distance', distanceText)
      set('est-duration', durationText)
      set('est-rate', `${rateKm.toFixed(2)} €/km`)
      set('est-price', `${priceLow} – ${priceHigh} €`)
      const periodEl = document.getElementById('est-period')
      if (periodEl) periodEl.textContent = night ? '🌙 Tarif nuit' : '☀️ Tarif jour'

      const waBtn = document.getElementById('whatsapp-cta') as HTMLAnchorElement | null
      if (waBtn && window._lastEstimate) {
        const e = window._lastEstimate
        const msg = `Bonjour, je souhaite réserver un moto-taxi 🏍️\n\n📍 Départ : ${e.origin}\n🏁 Destination : ${e.destination}\n📏 Distance : ${e.distance}\n⏱️ Durée : ${e.duration}\n💰 Estimation : ${e.priceLow}–${e.priceHigh} € (${e.period})\n\nPouvez-vous confirmer la disponibilité ?`
        waBtn.href = `https://wa.me/33611916560?text=${encodeURIComponent(msg)}`
      }

      const result = document.getElementById('estimate-result')
      if (result) { result.classList.add('visible'); result.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }
    }

    function showError(msg: string) {
      const result = document.getElementById('estimate-result')
      if (result) {
        result.innerHTML = `<p style="color:var(--color-signal);text-align:center;font-weight:600;padding:16px;">${msg}</p>`
        result.classList.add('visible')
      }
    }

    function calculateRoute() {
      const btn = document.getElementById('calculate-btn') as HTMLButtonElement | null
      if (btn) { btn.innerHTML = '<span class="spinner"></span> Calcul en cours...'; btn.disabled = true }

      directionsService!.route(
        {
          origin: originPlace!.geometry!.location!,
          destination: destPlace!.geometry!.location!,
          travelMode: google.maps.TravelMode.DRIVING,
          drivingOptions: { departureTime: new Date(), trafficModel: google.maps.TrafficModel.BEST_GUESS },
        },
        (result, status) => {
          if (btn) { btn.innerHTML = '🔍 Calculer le prix'; btn.disabled = false }
          if (status === 'OK' && result) {
            const leg = result.routes[0].legs[0]
            const distKm = leg.distance!.value / 1000
            const durMin = leg.duration!.value / 60
            const durTrafficMin = (leg as any).duration_in_traffic ? (leg as any).duration_in_traffic.value / 60 : durMin
            displayEstimate(distKm, durMin, durTrafficMin, leg.distance!.text, leg.duration!.text)
            directionsRenderer!.setDirections(result)
            document.getElementById('map-preview')?.classList.add('visible')
          } else {
            showError('Itinéraire introuvable. Vérifiez les adresses.')
          }
        }
      )
    }

    window.initMapsCalculator = () => {
      directionsService = new google.maps.DirectionsService()
      directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: { strokeColor: '#E63B2E', strokeWeight: 5 },
      })

      const originInput = document.getElementById('origin') as HTMLInputElement | null
      const destInput = document.getElementById('destination') as HTMLInputElement | null
      if (!originInput || !destInput) return

      originAutocomplete = new google.maps.places.Autocomplete(originInput, {
        componentRestrictions: { country: 'fr' },
        fields: ['geometry', 'formatted_address', 'name'],
      })
      destAutocomplete = new google.maps.places.Autocomplete(destInput, {
        componentRestrictions: { country: 'fr' },
        fields: ['geometry', 'formatted_address', 'name'],
      })
      originAutocomplete.addListener('place_changed', () => { originPlace = originAutocomplete!.getPlace(); checkAndCalculate() })
      destAutocomplete.addListener('place_changed', () => { destPlace = destAutocomplete!.getPlace(); checkAndCalculate() })

      const mapDiv = document.getElementById('map-preview')
      if (mapDiv) {
        map = new google.maps.Map(mapDiv, {
          zoom: 12, center: { lat: 48.8566, lng: 2.3522 }, disableDefaultUI: true,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#E8E4DD' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d9e8' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#F5F3EE' }] },
          ],
        })
        directionsRenderer.setMap(map)
      }
    }

    window.triggerCalculate = () => {
      if (!originPlace || !destPlace) {
        const originVal = (document.getElementById('origin') as HTMLInputElement)?.value
        const destVal = (document.getElementById('destination') as HTMLInputElement)?.value
        if (!originVal || !destVal) { showError('Veuillez saisir une adresse de départ et de destination.'); return }
        const geocoder = new google.maps.Geocoder()
        let resolved = 0
        const tryCalc = () => { resolved++; if (resolved === 2) calculateRoute() }
        if (!originPlace) {
          geocoder.geocode({ address: originVal, region: 'fr' }, (results, status) => {
            if (status === 'OK' && results) originPlace = { geometry: { location: results[0].geometry.location } as any, formatted_address: results[0].formatted_address } as any
            tryCalc()
          })
        } else tryCalc()
        if (!destPlace) {
          geocoder.geocode({ address: destVal, region: 'fr' }, (results, status) => {
            if (status === 'OK' && results) destPlace = { geometry: { location: results[0].geometry.location } as any, formatted_address: results[0].formatted_address } as any
            tryCalc()
          })
        } else tryCalc()
      } else {
        calculateRoute()
      }
    }
  }, [])

  return (
    <section ref={ref} className="section calculator" id="calculateur">
      <div className="container">
        <div className="calculator-wrapper">

          <div className="calculator-info">
            <span className="sec-label" style={{ color: 'rgba(245,243,238,0.4)' }}>
              <b style={{ color: 'var(--color-signal)' }}>01</b> — Calculateur
            </span>
            <h2>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300 }}>Estimez votre course<br /></span>
              <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>en temps réel.</em>
            </h2>
            <div className="pricing-table" style={{ marginBottom: 28 }}>
              <div className="pricing-row">
                <span className="label">Prise en charge</span>
                <span className="value">3,50 €</span>
              </div>
              <div className="pricing-row">
                <span className="label">Tarif jour (7h–20h)</span>
                <span className="value">1,80 € / km</span>
              </div>
              <div className="pricing-row">
                <span className="label">Tarif nuit (20h–7h)</span>
                <span className="value">2,40 € / km</span>
              </div>
              <div className="pricing-row highlight">
                <span className="label">Tarif minimum</span>
                <span className="value">8,00 €</span>
              </div>
            </div>
            <p style={{ color: 'rgba(245,243,238,0.55)', fontSize: '0.85rem' }}>
              Tarifs week-end et jours fériés : tarif nuit appliqué toute la journée.
            </p>
          </div>

          <div className="calculator-form" id="estimer">
            <h3>Estimez votre trajet</h3>
            <p className="subtitle">Saisissez vos adresses pour obtenir un prix instantané</p>

            <div className="form-group">
              <label htmlFor="origin">📍 Adresse de départ</label>
              <div className="input-wrapper">
                <span className="input-icon">📍</span>
                <input type="text" id="origin" placeholder="Ex : 1 Rue de Rivoli, Paris" autoComplete="off" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="destination">🏁 Adresse de destination</label>
              <div className="input-wrapper">
                <span className="input-icon">🏁</span>
                <input type="text" id="destination" placeholder="Ex : Aéroport CDG, Terminal 2" autoComplete="off" />
              </div>
            </div>

            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="form-group">
                <label htmlFor="trip-date">📅 Date</label>
                <div className="input-wrapper">
                  <span className="input-icon">📅</span>
                  <input type="date" id="trip-date" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="trip-time">🕐 Heure</label>
                <div className="input-wrapper">
                  <span className="input-icon">🕐</span>
                  <input type="time" id="trip-time" />
                </div>
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              id="calculate-btn"
              onClick={() => window.triggerCalculate?.()}
            >
              <span className="btn-bg" aria-hidden="true" />
              <span className="btn-label">🔍 Calculer le prix</span>
            </button>

            <div className="estimate-result" id="estimate-result">
              <div className="estimate-grid">
                <div className="estimate-item">
                  <div className="est-value" id="est-distance">—</div>
                  <div className="est-label">Distance</div>
                </div>
                <div className="estimate-item">
                  <div className="est-value" id="est-duration">—</div>
                  <div className="est-label">Durée estimée</div>
                </div>
                <div className="estimate-item">
                  <div className="est-value" id="est-rate">—</div>
                  <div className="est-label">Tarif appliqué</div>
                </div>
              </div>
              <div className="estimate-price">
                <div className="price-amount" id="est-price">—</div>
                <div className="price-note" id="est-period">Estimation indicative</div>
              </div>
              <div id="map-preview" />
              <p className="estimate-disclaimer">Prix estimatif. Le tarif final peut varier selon les conditions de circulation.</p>
              <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                <a href="tel:+33611916560" className="btn-primary" style={{ flex: 1, justifyContent: 'center', minWidth: 140 }}>
                  <span className="btn-bg" aria-hidden="true" />
                  <span className="btn-label">📞 Appeler</span>
                </a>
                <a href="https://wa.me/33611916560" id="whatsapp-cta" target="_blank" rel="noopener" className="btn-wa" style={{ flex: 1, justifyContent: 'center', minWidth: 140 }}>
                  <span className="btn-bg" aria-hidden="true" />
                  <span className="btn-label">💬 Réserver sur WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GMAPS_KEY}&libraries=places&callback=initMapsCalculator`}
        async
        defer
      />
    </section>
  )
}
