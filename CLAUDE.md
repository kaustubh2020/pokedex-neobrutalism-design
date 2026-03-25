# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server (Vite HMR)
npm run build      # Production build
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

No test suite is configured.

## Architecture

**React 18 + Vite SPA** that fetches data from the public PokéAPI (`https://pokeapi.co/api/v2`).

### Routing
Two routes via React Router v6:
- `/` — `Home.jsx` wraps `PokemonGrid` (list + search + type filter)
- `/pokemon/:id` — `PokemonDetail.jsx` (full detail view with evolutions, moves, type effectiveness)

### Data Flow
1. `src/data/pokemonList.js` — static array of all 1000+ Pokémon URLs (no API call needed for the list itself)
2. `src/hooks/usePokemon.js` — batches loading 20 Pokémon at a time; drives infinite scroll via `react-infinite-scroll-component`; filters are applied client-side on already-loaded data
3. `src/utils/api.js` — thin wrappers over native `fetch` for PokéAPI endpoints; includes `Map`-based in-memory caching for evolution chains and move details

### State Management
No global store. State lives in:
- `usePokemon` hook — pagination, loading, error
- Component-level `useState` — search term, type filter selections, shiny toggle

### Design System (Neo-Brutalism)
Custom Tailwind tokens in `tailwind.config.js`:
- Colors: `neo-black`, `neo-white`, `neo-yellow`, `neo-pink`, `neo-blue`
- Shadows: `shadow-neo` (4px solid offset), `shadow-neo-lg` (8px)
- Heavy borders (2–4 px), bold typography, squared/asymmetric corners

Type-specific colors (all 18 types) live in `src/utils/typeColors.js` — each type has a `highlight` and `background` variant. Type matchup logic is in `src/utils/typeEffectiveness.js`.

### Animation
All motion uses **Framer Motion** (`motion` package). Entry/exit transitions, hover effects, staggered lists, and animated progress bars are used throughout. Keep new components consistent with this pattern.

### Performance Notes
- `PokemonCard` and `TypeFilter` are wrapped in `React.memo`
- Infinite scroll is disabled when a search/type filter is active (full filtered list shown instead)
- Avoid importing Axios — the codebase uses native `fetch` despite Axios being listed as a dependency
