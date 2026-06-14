import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "motion/react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePokemon } from '../../hooks/usePokemon';
import { useFilteredPokemon } from '../../hooks/useFilteredPokemon';
import { pokemonList } from '../../data/pokemonList';
import PokemonCard from './PokemonCard';
import TypeFilter from '../ui/TypeFilter';
import Pokeball from '../ui/Pokeball';
import { SkeletonGrid } from '../ui/SkeletonCard';
import EmptyState from '../ui/EmptyState';

const PokemonGrid = () => {
  const navigate = useNavigate();
  const { pokemon, loading, error, hasMore, loadMore } = usePokemon();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);

  const filtered = useFilteredPokemon(searchTerm, selectedTypes);
  const hasFilters = filtered.active;

  const displayed = hasFilters ? filtered.results : pokemon;
  const showEmptyState = hasFilters && !filtered.loading && displayed.length === 0;

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

  const handleRandom = () => {
    const entry = pokemonList[Math.floor(Math.random() * pokemonList.length)];
    navigate(`/pokemon/${entry.url.split('/')[6]}`);
  };

  if (error && pokemon.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-16 text-center">
        <div className="neo-card p-8 bg-neo-pink inline-block">
          <Pokeball className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl uppercase mb-2">Failed to load Pokémon</h2>
          <p className="font-bold">Check your connection and refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero */}
      <section className="relative mb-10 border-4 border-neo-black bg-neo-red shadow-neo-xl overflow-hidden">
        {/* decorative pokeballs */}
        <Pokeball mono className="absolute -right-10 -top-10 w-48 h-48 text-neo-red opacity-100 animate-spin-slow" />
        <Pokeball mono className="absolute -left-8 -bottom-12 w-36 h-36 text-neo-red animate-spin-slow" />

        <div className="relative px-6 py-10 md:py-14 text-center">
          <motion.span
            initial={{ rotate: -8, scale: 0 }}
            animate={{ rotate: -6, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="neo-sticker bg-neo-yellow mb-4"
          >
            Gotta catch &apos;em all!
          </motion.span>

          <h1 className="text-5xl md:text-7xl text-neo-white uppercase [text-shadow:5px_5px_0_#16161A]">
            Pokédex
          </h1>

          <p className="mt-3 font-mono font-bold text-neo-white text-sm md:text-base">
            {pokemonList.length} Pokémon · Neo-Brutalism Edition
          </p>

          {/* Search */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Pokeball className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7" />
              <input
                type="text"
                placeholder="Search by name or number…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neo-input pl-12"
                aria-label="Search Pokémon by name or ID"
              />
            </div>
            <button onClick={handleRandom} className="neo-button bg-neo-yellow text-neo-black whitespace-nowrap">
              🎲 Random
            </button>
          </motion.div>
        </div>
      </section>

      <TypeFilter
        selectedTypes={selectedTypes}
        onTypeToggle={handleTypeToggle}
        onClearFilters={handleClearFilters}
      />

      {hasFilters && !showEmptyState && (
        <p className="font-mono font-bold mb-2">
          {filtered.totalMatches} match{filtered.totalMatches === 1 ? '' : 'es'} in the whole Pokédex
        </p>
      )}

      {showEmptyState ? (
        <EmptyState
          icon="🔍"
          title="No Pokémon Found"
          message="Try adjusting your filters or search term to find what you're looking for."
          onClearFilters={handleClearFilters}
          showClearButton
        />
      ) : (
        <InfiniteScroll
          dataLength={displayed.length}
          next={hasFilters ? filtered.loadMore : loadMore}
          hasMore={hasFilters ? filtered.hasMore : hasMore}
          loader={<SkeletonGrid count={4} />}
          endMessage={
            displayed.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <span className="neo-sticker bg-neo-green text-base">
                  🎉 That&apos;s every match — {displayed.length} Pokémon!
                </span>
              </motion.div>
            )
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-6">
            <AnimatePresence>
              {displayed.map((p) => (
                <motion.div
                  key={`pokemon-${p.id}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  <PokemonCard pokemon={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </InfiniteScroll>
      )}

      {/* Initial / filter loading states */}
      {((pokemon.length === 0 && loading) || (hasFilters && filtered.loading && displayed.length === 0)) && (
        <SkeletonGrid count={8} />
      )}
    </div>
  );
};

export default PokemonGrid;
