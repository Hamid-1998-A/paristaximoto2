/**
 * TaxiMoto Paris — Price Calculator
 * Requires Google Maps JavaScript API with Places + Directions libraries
 */

// ============================================================
// TARIFF CONFIGURATION — Edit these values to update pricing
// ============================================================
const TARIFF = {
  // Base fare (flag drop)
  baseFare: 3.50,

  // Per-km rate (day)
  ratePerKmDay: 1.80,

  // Per-km rate (night: 20h–7h, weekends & public holidays)
  ratePerKmNight: 2.40,

  // Minimum fare
  minimumFare: 8,
};

// ============================================================
// GOOGLE MAPS INIT
// ============================================================
let map = null;
let directionsService = null;
let directionsRenderer = null;
let originAutocomplete = null;
let destAutocomplete = null;
let originPlace = null;
let destPlace = null;

window.initMapsCalculator = function () {
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: false,
    polylineOptions: {
      strokeColor: '#e94560',
      strokeWeight: 5,
    }
  });

  // Initialize autocomplete on origin input
  const originInput = document.getElementById('origin');
  const destInput = document.getElementById('destination');

  if (!originInput || !destInput) return;

  originAutocomplete = new google.maps.places.Autocomplete(originInput, {
    componentRestrictions: { country: 'fr' },
    fields: ['geometry', 'formatted_address', 'name'],
  });

  destAutocomplete = new google.maps.places.Autocomplete(destInput, {
    componentRestrictions: { country: 'fr' },
    fields: ['geometry', 'formatted_address', 'name'],
  });

  originAutocomplete.addListener('place_changed', () => {
    originPlace = originAutocomplete.getPlace();
    checkAndCalculate();
  });

  destAutocomplete.addListener('place_changed', () => {
    destPlace = destAutocomplete.getPlace();
    checkAndCalculate();
  });

  // Init preview map
  const mapDiv = document.getElementById('map-preview');
  if (mapDiv) {
    map = new google.maps.Map(mapDiv, {
      zoom: 12,
      center: { lat: 48.8566, lng: 2.3522 },
      disableDefaultUI: true,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d9e8' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
        { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#fafafa' }] },
      ],
    });
    directionsRenderer.setMap(map);
  }
};

function checkAndCalculate() {
  if (originPlace?.geometry && destPlace?.geometry) {
    calculateRoute();
  }
}

function calculateRoute() {
  const calculateBtn = document.getElementById('calculate-btn');
  if (calculateBtn) {
    calculateBtn.innerHTML = '<span class="spinner"></span> Calcul en cours...';
    calculateBtn.disabled = true;
  }

  directionsService.route(
    {
      origin: originPlace.geometry.location,
      destination: destPlace.geometry.location,
      travelMode: google.maps.TravelMode.DRIVING,
      drivingOptions: {
        departureTime: new Date(),
        trafficModel: google.maps.TrafficModel.BEST_GUESS,
      },
    },
    (result, status) => {
      if (calculateBtn) {
        calculateBtn.innerHTML = '🔍 Calculer le prix';
        calculateBtn.disabled = false;
      }

      if (status === 'OK') {
        const leg = result.routes[0].legs[0];
        const distanceKm = leg.distance.value / 1000;
        const durationMin = leg.duration.value / 60;
        const durationWithTrafficMin = leg.duration_in_traffic
          ? leg.duration_in_traffic.value / 60
          : durationMin;

        displayEstimate(distanceKm, durationMin, durationWithTrafficMin, leg.distance.text, leg.duration.text);

        // Show map
        directionsRenderer.setDirections(result);
        const mapDiv = document.getElementById('map-preview');
        if (mapDiv) {
          mapDiv.classList.add('visible');
        }
      } else {
        showError('Itinéraire introuvable. Vérifiez les adresses.');
      }
    }
  );
}

function displayEstimate(distanceKm, durationMin, durationWithTrafficMin, distanceText, durationText) {
  const isNight = isNightRate();
  const rateKm = isNight ? TARIFF.ratePerKmNight : TARIFF.ratePerKmDay;

  let price = TARIFF.baseFare + (distanceKm * rateKm);
  price = Math.max(price, TARIFF.minimumFare);

  // Range (+/- 10%)
  const priceLow = Math.round(price * 0.9);
  const priceHigh = Math.round(price * 1.1);

  // Store for WhatsApp CTA
  window._lastEstimate = {
    origin: originPlace?.formatted_address || document.getElementById('origin')?.value || '',
    destination: destPlace?.formatted_address || document.getElementById('destination')?.value || '',
    distance: distanceText,
    duration: durationText,
    priceLow,
    priceHigh,
    period: isNight ? 'Tarif nuit' : 'Tarif jour',
  };

  // Update UI
  document.getElementById('est-distance').textContent = distanceText;
  document.getElementById('est-duration').textContent = durationText;
  document.getElementById('est-rate').textContent = `${rateKm.toFixed(2)} €/km`;
  document.getElementById('est-price').textContent = `${priceLow} – ${priceHigh} €`;
  document.getElementById('est-period').textContent = isNight ? '🌙 Tarif nuit' : '☀️ Tarif jour';

  // Update WhatsApp CTA link
  const waBtn = document.getElementById('whatsapp-cta');
  if (waBtn && window._lastEstimate) {
    const e = window._lastEstimate;
    const msg = `Bonjour, je souhaite réserver un moto-taxi 🏍️\n\n📍 Départ : ${e.origin}\n🏁 Destination : ${e.destination}\n📏 Distance : ${e.distance}\n⏱️ Durée : ${e.duration}\n💰 Estimation : ${e.priceLow}–${e.priceHigh} € (${e.period})\n\nPouvez-vous confirmer la disponibilité ?`;
    waBtn.href = `https://wa.me/33611916560?text=${encodeURIComponent(msg)}`;
  }

  const result = document.getElementById('estimate-result');
  if (result) {
    result.classList.add('visible');
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function isNightRate() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  return hour >= 20 || hour < 7 || day === 0 || day === 6;
}

function showError(msg) {
  const result = document.getElementById('estimate-result');
  if (result) {
    result.innerHTML = `<p style="color:#e94560;text-align:center;font-weight:600;">⚠️ ${msg}</p>`;
    result.classList.add('visible');
  }
}

// ============================================================
// Manual calculate button (for when autocomplete doesn't fire)
// ============================================================
window.triggerCalculate = function () {
  if (!originPlace || !destPlace) {
    // Try to geocode manually
    const originVal = document.getElementById('origin')?.value;
    const destVal = document.getElementById('destination')?.value;

    if (!originVal || !destVal) {
      showError('Veuillez saisir une adresse de départ et de destination.');
      return;
    }

    const geocoder = new google.maps.Geocoder();
    let resolved = 0;

    const tryCalculate = () => {
      resolved++;
      if (resolved === 2) calculateRoute();
    };

    if (!originPlace) {
      geocoder.geocode({ address: originVal, region: 'fr' }, (results, status) => {
        if (status === 'OK') {
          originPlace = { geometry: { location: results[0].geometry.location }, formatted_address: results[0].formatted_address };
        }
        tryCalculate();
      });
    } else { tryCalculate(); }

    if (!destPlace) {
      geocoder.geocode({ address: destVal, region: 'fr' }, (results, status) => {
        if (status === 'OK') {
          destPlace = { geometry: { location: results[0].geometry.location }, formatted_address: results[0].formatted_address };
        }
        tryCalculate();
      });
    } else { tryCalculate(); }
  } else {
    calculateRoute();
  }
};
