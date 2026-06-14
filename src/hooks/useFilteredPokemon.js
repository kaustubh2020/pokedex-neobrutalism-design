import { useState, useEffect } from "react";
import {
  getPokemonDetails,
  getPokemonSpecies,
  getPokemonIdsByType,
} from "../utils/api";
import { pokemonList } from "../data/pokemonList";

const PAGE_SIZE = 24;

// IDs above 10000 are alternate forms with no species entry — exclude them
// so match counts line up with what actually renders
const allEntries = pokemonList
  .map((p) => ({ id: parseInt(p.url.split("/")[6]), name: p.name }))
  .filter((p) => p.id < 10000);

/**
 * Filter-aware loader: matches search/type filters against the FULL Pokédex
 * (the static list + the /type endpoint), then fetches details only for the
 * visible page of matches. This fixes the old behavior where filters only
 * applied to Pokémon already loaded by infinite scroll.
 */
export const useFilteredPokemon = (searchTerm, selectedTypes) => {
  const active = Boolean(searchTerm.trim()) || selectedTypes.length > 0;

  const [debounced, setDebounced] = useState(searchTerm);
  const [matchIds, setMatchIds] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Resolve which IDs match the current filters
  useEffect(() => {
    if (!active) {
      setMatchIds([]);
      setResults([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const term = debounced.trim().toLowerCase();
      let candidates = allEntries;
      if (term) {
        candidates = candidates.filter(
          (p) => p.name.includes(term) || p.id.toString() === term
        );
      }
      if (selectedTypes.length > 0) {
        try {
          const sets = await Promise.all(selectedTypes.map(getPokemonIdsByType));
          candidates = candidates.filter((p) => sets.some((s) => s.has(p.id)));
        } catch (err) {
          console.error("Error fetching type lists:", err);
        }
      }
      if (!cancelled) {
        setMatchIds(candidates.map((c) => c.id));
        setVisibleCount(PAGE_SIZE);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debounced, selectedTypes, active]);

  // Fetch details for the visible slice of matches
  useEffect(() => {
    if (!active) return;
    const ids = matchIds.slice(0, visibleCount);
    if (ids.length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const data = await Promise.all(
        ids.map(async (id) => {
          try {
            const [details, species] = await Promise.all([
              getPokemonDetails(String(id)),
              getPokemonSpecies(String(id)),
            ]);
            return { ...details, species };
          } catch {
            return null;
          }
        })
      );
      if (!cancelled) {
        setResults(data.filter(Boolean));
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchIds, visibleCount, active]);

  return {
    active,
    results,
    loading,
    hasMore: visibleCount < matchIds.length,
    totalMatches: matchIds.length,
    loadMore: () => setVisibleCount((c) => c + PAGE_SIZE),
  };
};
