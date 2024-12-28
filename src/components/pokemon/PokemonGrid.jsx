import { useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { usePokemon } from '../../hooks/usePokemon';
import PokemonCard from './PokemonCard';

const PokemonGrid = () => {
  const { pokemon, loading, progress } = usePokemon();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPokemon = pokemon.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toString().includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-6xl font-black text-center mb-8 uppercase">
        Pokédex
        <br />
        <span className='text-xl uppercase font-mono'>Neo-Brutalism design</span>
      </h1>

      <motion.div
        className="py-4 bg-neo-yellow"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <input
          type="text"
          placeholder="Search Pokémon by name or ID..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="neo-input"
        />
      </motion.div>

      {loading && (
        <motion.div
          className="my-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-full h-4 bg-neo-white border-2 border-neo-black rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-neo-pink"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
          </div>
          <p className="text-center mt-2">Loading Pokémons: {Math.round(progress)}%</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
        <AnimatePresence>
          {filteredPokemon.map((pokemon, index) => (
            <motion.div
              key={`pokemon-${index}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <PokemonCard pokemon={pokemon} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PokemonGrid;