import { useState, useEffect, useCallback } from "react";
import {
  getPokemonDetails,
  getPokemonSpecies,
  getEvolutionChain,
} from "../utils/api";
import { pokemonList } from "../data/pokemonList";

const BATCH_SIZE = 20;

export const usePokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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

        // Check if already loaded
        if (pokemon.some((p) => p.id === parseInt(id))) {
          return null;
        }

        try {
          // Fetch pokemon details
          const details = await getPokemonDetails(id);

          // Fetch species data
          const species = await getPokemonSpecies(id);

          // Fetch evolution chain
          const evolutionData = await getEvolutionChain(
            species.evolution_chain.url
          );

          return {
            ...details,
            species,
            evolutionChain: evolutionData,
          };
        } catch (err) {
          console.error(`Error fetching Pokemon ${id}:`, err);
          return null;
        }
      });

      const results = await Promise.all(pokemonPromises);
      const validResults = results.filter((p) => p !== null);

      setPokemon((prev) => {
        // Prevent duplicates
        const newPokemon = validResults.filter(
          (newP) => !prev.some((p) => p.id === newP.id)
        );
        return [...prev, ...newPokemon];
      });

      setCurrentIndex(endIndex);
      setHasMore(endIndex < pokemonList.length);
    } catch (err) {
      setError(err);
      console.error("Error fetching Pokemon batch:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentIndex, pokemon, isLoading]);

  // Load initial batch
  useEffect(() => {
    if (pokemon.length === 0 && !isLoading) {
      fetchBatch();
    }
  }, []);

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
