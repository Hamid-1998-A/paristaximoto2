# PROMPT — Migration Design · Site Existant → Next.js · "Signal Brutaliste"
> Version 3.0 — Adaptation design uniquement. Zéro modification de contenu ou de fonctionnement.

---

## RÔLE & MISSION

Tu es un ingénieur front-end senior spécialisé Next.js 14+ (App Router) et un designer système expert.

Tu reçois un site web existant en HTML/CSS/JavaScript, entièrement fonctionnel.
Ta mission est **uniquement** de :
1. Migrer la stack vers **Next.js App Router**
2. Appliquer le **design system "Signal Brutaliste"** ci-dessous

**Tu ne touches à rien d'autre.**

---

## RÈGLES ABSOLUES — LIRE AVANT TOUT

```
⛔ NE JAMAIS modifier le texte (titres, paragraphes, labels, CTA)
⛔ NE JAMAIS réorganiser ou supprimer des sections
⛔ NE JAMAIS changer l'ordre des éléments dans une section
⛔ NE JAMAIS altérer la logique métier, les états, les calculs
⛔ NE JAMAIS remplacer les interactions existantes par d'autres
⛔ NE JAMAIS inventer de nouvelles sections ou contenus
⛔ NE JAMAIS utiliser de couleurs hors de la palette définie
⛔ NE JAMAIS appliquer border-radius: 0 ou rounded-none

✅ Préserver : tout le texte mot pour mot
✅ Préserver : toutes les sections dans leur ordre exact
✅ Préserver : toute la logique JS (listeners, états, formulaires, APIs)
✅ Préserver : toutes les animations fonctionnelles existantes
✅ Transformer : les couleurs → palette Signal Brutaliste
✅ Transformer : la typographie → système défini ci-dessous
✅ Transformer : les espacements → système défini ci-dessous
✅ Transformer : les composants visuels → design system ci-dessous
✅ Ajouter : texture noise, micro-interactions, animations GSAP d'entrée
```

---

## ÉTAPE 1 — ANALYSE DU SITE EXISTANT

Avant d'écrire une seule ligne de code, cartographie le site :

1. **Sections** — Liste chaque section dans l'ordre exact d'apparition
2. **Composants** — Identifie les éléments réutilisables (nav, footer, cards, modals, formulaires...)
3. **Logique JS** — Note chaque interaction (listeners, états, timers, fetch, animations)
4. **Dépendances** — Repère les libs externes (jQuery, Swiper, GSAP, etc.)
5. **Assets** — Images, icônes, fonts actuellement utilisées

Présente cette cartographie avant de commencer la migration.

---

## ÉTAPE 2 — ARCHITECTURE NEXT.JS

```
src/
├── app/
│   ├── layout.tsx          ← fonts + SVG noise overlay + metadata
│   ├── page.tsx            ← assemblage des sections dans leur ordre original
│   └── globals.css         ← design system CSS complet
├── components/
│   ├── ui/                 ← Button, Tag, Card, Input (atomes réutilisables)
│   └── sections/           ← un fichier .tsx par section du site original
└── lib/
    ├── gsap-config.ts      ← registerPlugin centralisé
    └── utils.ts            ← helpers migrés depuis le JS original
```

**Règles de migration technique :**
- HTML → JSX (`class` → `className`, `for` → `htmlFor`, etc.)
- CSS classes existantes → design system (remplacer, ne pas dupliquer)
- `addEventListener` → hooks React (`useState`, `useEffect`, `useRef`)
- `fetch` / APIs → inchangés, migrés tels quels dans les composants
- Images → `next/image` avec les mêmes sources
- Fonts → `next/font/google` (voir section Typographie)

---

## DESIGN SYSTEM · "Signal Brutaliste" (Precision Brute)

### Identité
> Une salle de contrôle du futur — aucune décoration, densité d'information pure.
> Chaque élément justifie sa présence ou disparaît.
> Le brutalisme ici n'est pas laid — il est honnête.

---

### Palette — CSS Custom Properties
```css
:root {
  --color-paper:     #E8E4DD; /* Primaire — surfaces, cartes                */
  --color-signal:    #E63B2E; /* Accent — CTA, highlights, alertes          */
  --color-off-white: #F5F3EE; /* Fond principal                             */
  --color-ink:       #111111; /* Texte, éléments sombres                    */
  --color-ink-60:    rgba(17,17,17,0.6);  /* Texte secondaire               */
  --color-ink-15:    rgba(17,17,17,0.15); /* Bordures, séparateurs           */
}
```

Règle stricte : **zéro couleur hors de cette palette.** Si le site original utilise d'autres couleurs, les mapper vers le token le plus proche.

---

### Typographie

**Chargement via `next/font/google` dans `layout.tsx` :**
```tsx
import { Space_Grotesk, DM_Serif_Display, Space_Mono } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700']
})
const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: '400',
  style: ['normal', 'italic']
})
const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700']
})
```

**Table d'application — mapper chaque élément du site original :**
| Élément | Font | Variable CSS | Tracking |
|---|---|---|---|
| Titres UI, nav, labels | Space Grotesk | `var(--font-sans)` | `-0.04em` |
| Titres hero / section majeure | DM Serif Display Italic | `var(--font-serif)` | `0` |
| Données, chiffres, tags, code | Space Mono | `var(--font-mono)` | `0.02em` |
| Corps de texte | Space Grotesk 300 | `var(--font-sans)` | `-0.02em` |

**Pattern titre hero/section majeure :**
```tsx
{/* Appliquer à tous les H1 et titres de sections primaires */}
<h1>
  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
    {/* Première partie du titre — texte original inchangé */}
  </span>
  <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
    {/* Deuxième partie / mot-clé — texte original inchangé */}
  </em>
</h1>
```

---

### Système de Rayons
**Aucun angle vif nulle part.** Règle absolue, sans exception.

```css
:root {
  --radius-sm: 1.25rem; /* Tags, badges, inputs, boutons     */
  --radius-md: 2rem;    /* Cards, blocs de contenu           */
  --radius-lg: 2.5rem;  /* Sections, modals, panels larges   */
  --radius-xl: 3rem;    /* Hero containers, footer top       */
}
```

Application systématique :
```css
button, input, select, textarea, .tag, .badge  { border-radius: var(--radius-sm); }
.card, .block, .panel, article                 { border-radius: var(--radius-md); }
.modal, .drawer, .section-container           { border-radius: var(--radius-lg); }
.hero-wrapper, .page-wrapper, footer           { border-radius: var(--radius-xl); }
```

---

### Espacements
```css
:root {
  --space-section: clamp(5rem, 12vw, 10rem);
  --space-block:   clamp(2.5rem, 5vw, 4rem);
  --space-gap:     clamp(1rem, 2.5vw, 1.75rem);
}

.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 5vw, 4rem);
}
```

---

### Bordures & Séparateurs
```css
.border-default { border: 1px solid var(--color-ink-15); }
.border-section  { border-top: 2px solid var(--color-ink); }
.border-accent   { border-left: 3px solid var(--color-signal); }
```

---

### Composants UI

#### Boutons — Feeling Magnétique Obligatoire
**Chaque bouton du site original** reçoit cette structure :

```tsx
<button className="btn-primary">
  <span className="btn-bg" aria-hidden="true" />
  <span className="btn-label">{/* texte original inchangé */}</span>
</button>
```

```css
.btn-primary,
.btn-secondary {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.875rem 1.75rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transform: scale(1);
  transition:
    transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.btn-primary   { background: var(--color-ink); color: var(--color-off-white); border: none; }
.btn-secondary { background: transparent; color: var(--color-ink); border: 1px solid var(--color-ink); }

.btn-primary:hover,
.btn-secondary:hover { transform: scale(1.03); }

.btn-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--color-signal);
  transform: translateY(100%);
  transition: transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.btn-primary:hover .btn-bg,
.btn-secondary:hover .btn-bg { transform: translateY(0); }

.btn-label { position: relative; z-index: 1; }
```

#### Cartes
```css
.card {
  background: var(--color-paper);
  border: 1px solid var(--color-ink-15);
  border-radius: var(--radius-md);
  padding: 2rem;
  transition:
    transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.card:hover {
  transform: scale(1.01);
  box-shadow: 0 8px 32px rgba(17,17,17,0.08);
}
.card--accent { border-left: 3px solid var(--color-signal); }
```

#### Tags / Labels / Badges
```css
.tag {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-60);
  border: 1px solid var(--color-ink-15);
  border-radius: var(--radius-sm);
  padding: 0.25rem 0.625rem;
}
.tag--signal { color: var(--color-signal); border-color: var(--color-signal); }
```

#### Inputs / Formulaires
```css
.input {
  background: var(--color-off-white);
  border: 1px solid var(--color-ink-15);
  border-bottom: 2px solid var(--color-ink);
  border-radius: var(--radius-sm);
  font-family: var(--font-sans);
  font-size: 1rem;
  padding: 0.75rem 1rem;
  outline: none;
  width: 100%;
  transition: border-color 150ms ease;
}
.input:focus { border-color: var(--color-signal); }
```

#### Liens & Éléments Interactifs — Lift Effect
```css
a,
[role="button"],
.interactive,
nav a {
  transition: transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
a:hover,
[role="button"]:hover,
.interactive:hover,
nav a:hover { transform: translateY(-1px); }
```

---

## TEXTURE VISUELLE — Noise Overlay Global

Ajouter dans `layout.tsx`, comme **premier enfant du `<body>`** :

```tsx
{/* Noise overlay — élimine les aplats digitaux plats — NE PAS MODIFIER */}
<svg
  aria-hidden="true"
  style={{
    position: 'fixed', inset: 0,
    width: '100%', height: '100%',
    pointerEvents: 'none',
    zIndex: 9999,
    opacity: 0.05
  }}
>
  <filter id="grain">
    <feTurbulence
      type="fractalNoise"
      baseFrequency="0.65"
      numOctaves="3"
      stitchTiles="stitch"
    />
    <feColorMatrix type="saturate" values="0" />
  </filter>
  <rect width="100%" height="100%" filter="url(#grain)" />
</svg>
```

Règles : opacité fixe `0.05`, ne jamais dépasser `0.08`, `pointer-events: none` impératif.

---

## ANIMATIONS GSAP — Cycle de Vie & Conventions

### Setup
```bash
npm install gsap
```

```ts
// src/lib/gsap-config.ts
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }
```

### Pattern Obligatoire — `gsap.context()` dans `useEffect`

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap-config'

export default function AnySection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Entrée texte
      gsap.fromTo('.anim-text',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '.anim-text', start: 'top 82%' }
        }
      )

      // Entrée cartes / conteneurs
      gsap.fromTo('.anim-card',
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: '.anim-card', start: 'top 82%' }
        }
      )

      // Morphisme / transition d'état
      gsap.to('.anim-morph', {
        scaleX: 1,
        duration: 0.6,
        ease: 'power2.inOut'
      })

    }, ref)

    return () => ctx.revert()
  }, [])

  return <div ref={ref}>...</div>
}
```

### Table de Référence Complète
| Contexte | Easing | Stagger | Animation |
|---|---|---|---|
| Entrée texte / titres | `power3.out` | `0.08` | `y: 24→0, opacity: 0→1` |
| Entrée cartes / blocs | `power3.out` | `0.15` | `y: 40→0, scale: 0.97→1` |
| Entrée hero | `power3.out` | `0.12` | `y: 40→0, opacity: 0→1` |
| Morphisme / état UI | `power2.inOut` | — | transition propriété unique |
| Sortie / dismiss | `power2.in` | `0.06` | inverser y et opacity |
| Reveal barre / ligne | `power4.out` | — | `scaleX: 0→1` |
| Parallaxe (scrub) | `none` | — | `yPercent: -15→0` |

### Règles GSAP Absolues
1. `gsap.context()` sur chaque composant animé — zéro exception
2. `ctx.revert()` dans chaque `return` de `useEffect` — zéro exception
3. `'use client'` en tête de chaque fichier avec GSAP
4. `registerPlugin` dans `gsap-config.ts` uniquement — jamais dans les composants
5. Stagger texte = `0.08` / Stagger conteneurs = `0.15` — valeurs fixes
6. Entrées = `power3.out` / Morphismes = `power2.inOut` — deux easings par défaut
7. Les animations GSAP **s'ajoutent** aux interactions existantes, ne les remplacent jamais

---

## ÉTAPE 3 — MIGRATION SECTION PAR SECTION

Pour **chaque section** du site original, dans l'ordre exact :

```
1. Créer le composant dans src/components/sections/[NomSection].tsx
2. Migrer le HTML → JSX (attributs, className, etc.)
3. Appliquer le design system :
   - Remplacer toutes les couleurs → tokens CSS
   - Remplacer toutes les fonts → variables --font-*
   - Remplacer tous les border-radius → tokens --radius-*
   - Appliquer les classes .btn-*, .card, .tag, .input sur les éléments correspondants
4. Migrer la logique JS → hooks React (useState, useEffect, useRef)
   ⚠️ La logique doit fonctionner identiquement à l'original
5. Ajouter les animations GSAP d'entrée via gsap.context()
   ⚠️ Ne remplace pas les animations fonctionnelles existantes — s'ajoute par-dessus
6. Vérifier que le comportement est identique à l'original
```

---

## CHECKLIST DE VÉRIFICATION FINALE

### Contenu & Structure
- [ ] Toutes les sections présentes dans l'ordre exact du site original
- [ ] Zéro texte modifié (titres, paragraphes, labels, CTA)
- [ ] Zéro section ajoutée ou supprimée
- [ ] Zéro élément réorganisé dans une section

### Fonctionnement
- [ ] Toutes les interactions JS fonctionnent (états, timers, fetch, formulaires)
- [ ] Toutes les animations fonctionnelles originales préservées
- [ ] Navigation et liens opérationnels
- [ ] Formulaires et validations inchangés

### Design System
- [ ] Palette respectée — zéro couleur hors système
- [ ] `Space Grotesk` sur tous les titres UI, nav, labels
- [ ] `DM Serif Display Italic` sur tous les titres hero et sections majeures
- [ ] `Space Mono` sur toutes les données, chiffres, tags, code
- [ ] `--radius-md` minimum sur toutes les cartes et conteneurs
- [ ] `--radius-sm` sur tous les boutons, inputs, tags
- [ ] Zéro `border-radius: 0` ou `rounded-none` dans le code final
- [ ] SVG noise overlay présent dans `layout.tsx` à opacité `0.05`

### Micro-Interactions
- [ ] Tous les boutons : `overflow: hidden` + `<span>` glissant
- [ ] Tous les boutons : `scale(1.03)` au hover
- [ ] Tous les liens : `translateY(-1px)` au hover
- [ ] Toutes les cartes : `scale(1.01)` + ombre renforcée au hover

### GSAP
- [ ] Chaque composant animé : `gsap.context()` scopé à un `ref`
- [ ] Chaque composant animé : `ctx.revert()` dans le `return`
- [ ] Stagger texte = `0.08` / Stagger cartes = `0.15`
- [ ] Entrées = `power3.out` / Morphismes = `power2.inOut`
- [ ] `'use client'` en tête de chaque fichier avec GSAP

### Technique Next.js
- [ ] Fonts chargées via `next/font/google`
- [ ] Images migrées vers `next/image`
- [ ] `gsap-config.ts` centralise le `registerPlugin`
- [ ] Responsive préservé ou amélioré

---

## FICHIERS À GÉNÉRER EN PRIORITÉ

```
1. src/app/globals.css              ← variables CSS + reset + tous les utilitaires
2. src/app/layout.tsx               ← fonts + SVG noise overlay
3. src/lib/gsap-config.ts           ← registerPlugin centralisé
4. src/components/ui/Button.tsx     ← bouton magnétique réutilisable
5. src/components/ui/Card.tsx       ← carte réutilisable
6. src/components/ui/Tag.tsx        ← tag réutilisable
7. src/components/ui/Input.tsx      ← input réutilisable
8. src/components/sections/[*].tsx  ← une par une dans l'ordre original
9. src/app/page.tsx                 ← assemblage final dans l'ordre original
```
