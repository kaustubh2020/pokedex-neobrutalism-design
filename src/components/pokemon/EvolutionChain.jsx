/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react";
import { getPokemonSpecies, getEvolutionChain, getPokemonDetails } from '../../utils/api';
import Loading from "../ui/Loading";

const EvolutionChain = ({ pokemonId }) => {
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const processEvolutionNode = async (node, chain = []) => {
      const pokemonId = node.species.url.split('/')[6];
      const pokemonDetails = await getPokemonDetails(pokemonId);

      chain.push({
        id: pokemonId,
        name: node.species.name,
        image: pokemonDetails.sprites.other['official-artwork'].front_default,
        minLevel: node.evolution_details?.[0]?.min_level,
        trigger: node.evolution_details?.[0]?.trigger?.name
      });

      if (node.evolves_to?.length > 0) {
        for (const evolution of node.evolves_to) {
          await processEvolutionNode(evolution, chain);
        }
      }
      return chain;
    };

    const fetchEvolutionChain = async () => {
      try {
        const species = await getPokemonSpecies(pokemonId);
        const evolutionData = await getEvolutionChain(species.evolution_chain.url);
        const chain = await processEvolutionNode(evolutionData.chain);
        setEvolutionChain(chain);
      } catch (error) {
        console.error('Error fetching evolution chain:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvolutionChain();
  }, [pokemonId]);

  if (loading) return <Loading />;
  if (evolutionChain.length <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 neo-card p-6"
    >
      <h3 className="text-2xl font-bold mb-4">Evolution Chain</h3>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {evolutionChain.map((pokemon, index) => (
          <div key={pokemon.id} className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(`/pokemon/${pokemon.id}`)}
              className="cursor-pointer"
            >
              <motion.img
                initial={{ rotate: 0 }}
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
                src={pokemon.image}
                alt={pokemon.name}
                className="w-32 h-32 object-contain"
              />
              <p className="text-center capitalize font-bold">{pokemon.name}</p>
              {pokemon.minLevel && (
                <p className="text-sm text-gray-600">Level {pokemon.minLevel}</p>
              )}
            </motion.div>
            {index < evolutionChain.length - 1 && (
              <motion.div
                className="mx-4 text-2xl font-bold"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default EvolutionChain;