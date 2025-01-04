import { useState, useEffect } from "react";
import {
  getPokemonDetails,
  getPokemonSpecies,
  getEvolutionChain,
} from "../utils/api";
import { pokemonList } from "../data/pokemonList";

export const usePokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPokemonData = async () => {
      if (currentIndex >= pokemonList.length) {
        return;
      }

      try {
        const id = pokemonList[currentIndex].url.split("/")[6];

        // First check if this pokemon is already in the array
        if (pokemon.some((p) => p.id === parseInt(id))) {
          setCurrentIndex((prev) => prev + 1);
          return;
        }

        // Fetch pokemon details
        const details = await getPokemonDetails(id);

        // Fetch species data
        const species = await getPokemonSpecies(id);

        // Fetch evolution chain
        const evolutionData = await getEvolutionChain(
          species.evolution_chain.url
        );

        // Combine all data
        const completeData = {
          ...details,
          species,
          evolutionChain: evolutionData,
        };

        // Update pokemon array while preventing duplicates
        setPokemon((prev) => {
          if (prev.some((p) => p.id === completeData.id)) {
            return prev;
          }
          return [...prev, completeData];
        });

        // Move to next pokemon
        setCurrentIndex((prev) => prev + 1);
      } catch (err) {
        setError(err);
        console.error("Error fetching Pokemon:", err);
      }
    };

    fetchPokemonData();
  }, [currentIndex, pokemon]);

  return {
    pokemon,
    loading: currentIndex < pokemonList.length,
    error,
    progress: (currentIndex / pokemonList.length) * 100,
  };
};
