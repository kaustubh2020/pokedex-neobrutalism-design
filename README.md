# Pokédex — Neo-Brutalism Design

A full-featured Pokédex web app built with React, styled with a bold Neo-Brutalism design system. Browse, search, and filter all 1000+ Pokémon, view detailed stats, type matchups, evolution chains, and moves.

**Live site:** [https://pokedex-neobrutalism.netlify.app](https://pokedex-neobrutalism.netlify.app)

---

## Features

- **Browse all 1000+ Pokémon** via infinite scroll (batches of 20)
- **Search** by name or Pokédex number
- **Filter by type** — all 18 types with multi-select
- **Detail page** for each Pokémon with:
  - Official artwork + shiny variant toggle
  - Base stats with animated bars
  - Type effectiveness (weaknesses, resistances, immunities)
  - Pokédex entry (flavour text)
  - Evolution chain with clickable sprites
  - Moves list (up to 60) with learn-method and type filters
  - Catch rate, base experience, and growth rate
- **Share** any Pokémon page via link, Twitter, Facebook, or WhatsApp
- **Scroll to top** button appears after scrolling down

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| UI | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS (custom Neo-Brutalism tokens) |
| Animation | Framer Motion (`motion`) |
| Data | [PokéAPI v2](https://pokeapi.co/) |
| Infinite scroll | react-infinite-scroll-component |
| Deployment | Netlify |

---

## Getting Started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build locally
npm run lint      # ESLint
```

---

## Design System

The UI uses a custom Neo-Brutalism theme defined in `tailwind.config.js`:

| Token | Value |
| --- | --- |
| `neo-black` | `#000000` |
| `neo-white` | `#FFFFFF` |
| `neo-yellow` | `#FFE033` |
| `neo-pink` | `#FF6B9D` |
| `neo-blue` | `#4361EE` |
| `shadow-neo` | `4px 4px 0 #000` |
| `shadow-neo-lg` | `8px 8px 0 #000` |

Type-specific colours (all 18 types) live in `src/utils/typeColors.js`.

---

## Project Structure

```text
src/
├── pages/           # Home (grid) + PokemonDetail
├── components/
│   ├── layout/      # Navbar, Layout
│   ├── pokemon/     # Card, Grid, EvolutionChain, Moves, TypeEffectiveness, …
│   └── ui/          # TypeFilter, ShareButton, SkeletonCard, EmptyState, …
├── hooks/
│   └── usePokemon.js   # Batched infinite-scroll data fetching
├── utils/
│   ├── api.js           # PokéAPI wrappers with in-memory cache
│   ├── typeColors.js    # Type → colour mapping
│   └── typeEffectiveness.js
└── data/
    └── pokemonList.js   # Static list of all Pokémon URLs
```

---

## Credits

Data from [PokéAPI](https://pokeapi.co/) — free, open Pokémon data.
Built by [Kaustubh Jaiswal](https://kaustubh-folio.netlify.app/).
