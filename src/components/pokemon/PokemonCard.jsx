import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { typeColors } from "../../utils/typeColors";

const PokemonCard = memo(({ pokemon }) => {
  const mainType = pokemon.types[0].type.name;
  const colors = typeColors[mainType];

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.95 }}
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

          <motion.div
            className="my-4 border-4 border-neo-black p-2 bg-neo-white rounded-tl-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={pokemon.sprites.other["official-artwork"].front_default}
              alt={pokemon.name}
              className="w-full h-48 object-contain"
            />
          </motion.div>

          <div className="flex gap-2">
            {pokemon.types.map(({ type }) => (
              <motion.span
                key={type.name}
                className="px-3 py-1 border-2 border-neo-black font-bold uppercase"
                style={{ backgroundColor: typeColors[type.name].bg }}
                whileHover={{ y: -2 }}
              >
                {type.name}
              </motion.span>
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
  }).isRequired,
};

PokemonCard.displayName = 'PokemonCard';

export default PokemonCard;