import { useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePokemon } from '../../hooks/usePokemon';
import PokemonCard from './PokemonCard';
import TypeFilter from '../ui/TypeFilter';
import { SkeletonGrid } from '../ui/SkeletonCard';
import EmptyState from '../ui/EmptyState';

const PokemonGrid = () => {
  const { pokemon, loading, hasMore, loadMore } = usePokemon();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleTypeToggle = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleClearFilters = () => {
    setSelectedTypes([]);
    setSearchTerm('');
  };

  const filteredPokemon = pokemon.filter(p => {
    // Search filter
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toString().includes(searchTerm);

    // Type filter
    const matchesType = selectedTypes.length === 0 ||
      p.types.some(({ type }) => selectedTypes.includes(type.name));

    return matchesSearch && matchesType;
  });

  const hasFilters = searchTerm || selectedTypes.length > 0;
  const showEmptyState = !loading && filteredPokemon.length === 0 && hasFilters;

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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="neo-input"
        />
      </motion.div>

      <TypeFilter
        selectedTypes={selectedTypes}
        onTypeToggle={handleTypeToggle}
        onClearFilters={handleClearFilters}
      />

      {showEmptyState ? (
        <EmptyState
          icon="🔍"
          title="No Pokémon Found"
          message="Try adjusting your filters or search term to find what you're looking for."
          onClearFilters={handleClearFilters}
          showClearButton={hasFilters}
        />
      ) : (
        <InfiniteScroll
          dataLength={filteredPokemon.length}
          next={loadMore}
          hasMore={hasMore && !hasFilters}
          loader={<SkeletonGrid count={4} />}
          endMessage={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-xl font-bold">
                🎉 You've seen all {filteredPokemon.length} Pokémon!
              </p>
            </motion.div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
            <AnimatePresence>
              {filteredPokemon.map((pokemon, index) => (
                <motion.div
                  key={`pokemon-${pokemon.id}`}
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
        </InfiniteScroll>
      )}

      {/* Initial Loading State */}
      {pokemon.length === 0 && loading && (
        <SkeletonGrid count={8} />
      )}
    </div>
  );
};

export default PokemonGrid;