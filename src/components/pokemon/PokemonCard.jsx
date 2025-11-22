import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { typeColors } from "../../utils/typeColors";

const PokemonCard = memo(({ pokemon }) => {
  const mainType = pokemon.types[0].type.name;
  const colors = typeColors[mainType];

  // Find highest stat
  const highestStat = pokemon.stats.reduce((max, stat) =>
    stat.base_stat > max.base_stat ? stat : max
  );

  // Get Pokemon category/genus from species data
  const category = pokemon.species?.genera?.find(g => g.language.name === 'en')?.genus || 'Pokémon';

  // Stat icons
  const statIcons = {
    'hp': '❤️',
    'attack': '⚔️',
    'defense': '🛡️',
    'special-attack': '✨',
    'special-defense': '💫',
    'speed': '⚡'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="neo-card overflow-hidden"
      style={{ backgroundColor: colors.highlight }}
    >
      <Link to={`/pokemon/${pokemon.id}`}>
        <div className="p-4">
          <div className="flex justify-between items-center border-b-4 border-neo-black pb-2">
            <h2 className="text-xl font-black uppercase">
              {pokemon.name}
            </h2>
            <span className="font-bold">
              #{String(pokemon.id).padStart(3, "0")}
            </span>
          </div>

          {/* Category */}
          <div className="mt-2 text-sm font-bold opacity-75">
            {category}
          </div>

          <motion.div
            className="my-4 border-4 border-neo-black p-2 bg-neo-white rounded-tl-xl relative"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={pokemon.sprites.other["official-artwork"].front_default}
              alt={pokemon.name}
              className="w-full h-48 object-contain"
            />

            {/* Highest Stat Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 border-2 border-neo-black px-2 py-1 text-xs font-bold shadow-neo"
            >
              {statIcons[highestStat.stat.name]} {highestStat.base_stat}
            </motion.div>
          </motion.div>

          {/* Types */}
          <div className="flex gap-2 mb-3">
            {pokemon.types.map(({ type }) => (
              <motion.span
                key={type.name}
                className="px-3 py-1 border-2 border-neo-black font-bold uppercase text-sm"
                style={{ backgroundColor: typeColors[type.name].bg }}
                whileHover={{ y: -2 }}
              >
                {type.name}
              </motion.span>
            ))}
          </div>

          {/* Mini Stats Preview */}
          <div className="grid grid-cols-3 gap-1 text-xs">
            {pokemon.stats.slice(0, 3).map((stat) => (
              <div key={stat.stat.name} className="bg-neo-white border border-neo-black p-1">
                <div className="font-bold uppercase truncate text-[10px]">
                  {stat.stat.name.replace('-', ' ')}
                </div>
                <div className="font-black">{stat.base_stat}</div>
              </div>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

PokemonCard.propTypes = {
  pokemon: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    types: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.shape({
          name: PropTypes.string.isRequired,
        }),
      }),
    ).isRequired,
    sprites: PropTypes.shape({
      other: PropTypes.shape({
        'official-artwork': PropTypes.shape({
          front_default: PropTypes.string,
        }),
      }),
    }).isRequired,
    stats: PropTypes.arrayOf(
      PropTypes.shape({
        base_stat: PropTypes.number.isRequired,
        stat: PropTypes.shape({
          name: PropTypes.string.isRequired,
        }),
      }),
    ).isRequired,
    species: PropTypes.shape({
      genera: PropTypes.arrayOf(
        PropTypes.shape({
          genus: PropTypes.string,
          language: PropTypes.shape({
            name: PropTypes.string,
          }),
        }),
      ),
    }),
  }).isRequired,
};

PokemonCard.displayName = 'PokemonCard';

export default PokemonCard;