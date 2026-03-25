import { useState, useEffect, useCallback, useRef } from "react";
import { getPokemonDetails, getPokemonSpecies } from "../utils/api";
import { pokemonList } from "../data/pokemonList";

const BATCH_SIZE = 20;

export const usePokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Track loaded IDs without including the pokemon array in useCallback deps
  const loadedIds = useRef(new Set());

  const fetchBatch = useCallback(async () => {
    if (currentIndex >= pokemonList.length || isLoading) {
      setHasMore(false);
      return;
    }

    setIsLoading(true);

    try {
      const endIndex = Math.min(currentIndex + BATCH_SIZE, pokemonList.length);
      const batch = pokemonList.slice(currentIndex, endIndex);

      const pokemonPromises = batch.map(async (item) => {
        const id = item.url.split("/")[6];
        const numericId = parseInt(id);

        if (loadedIds.current.has(numericId)) return null;

        try {
          const [details, species] = await Promise.all([
            getPokemonDetails(id),
            getPokemonSpecies(id),
          ]);

          loadedIds.current.add(numericId);

          return { ...details, species };
        } catch (err) {
          console.error(`Error fetching Pokemon ${id}:`, err);
          return null;
        }
      });

      const results = await Promise.all(pokemonPromises);
      const validResults = results.filter((p) => p !== null);

      setPokemon((prev) => [...prev, ...validResults]);
      setCurrentIndex(endIndex);
      setHasMore(endIndex < pokemonList.length);
    } catch (err) {
      setError(err);
      console.error("Error fetching Pokemon batch:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentIndex, isLoading]);

  useEffect(() => {
    if (pokemon.length === 0 && !isLoading) {
      fetchBatch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentional empty deps — initial load only

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchBatch();
    }
  }, [isLoading, hasMore, fetchBatch]);

  return {
    pokemon,
    loading: isLoading,
    error,
    progress: (currentIndex / pokemonList.length) * 100,
    hasMore,
    loadMore,
  };
};
