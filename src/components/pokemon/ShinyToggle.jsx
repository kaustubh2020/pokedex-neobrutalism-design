import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from "motion/react";

const ShinyToggle = memo(({ normalSprite, shinySprite, pokemonName, onToggle }) => {
  const [isShiny, setIsShiny] = useState(false);

  const handleToggle = () => {
    const newState = !isShiny;
    setIsShiny(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  if (!shinySprite) return null;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        className={`px-4 py-2 border-2 border-neo-black font-bold uppercase text-sm shadow-neo hover:shadow-neo-lg transition-all ${isShiny ? 'bg-neo-yellow' : 'bg-neo-white'
          }`}
        aria-label={`Toggle shiny ${pokemonName}`}
      >
        <span className="mr-2">{isShiny ? '✨' : '⭐'}</span>
        {isShiny ? 'Shiny' : 'Normal'}
      </motion.button>

      {isShiny && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 text-2xl"
        >
          ✨
        </motion.div>
      )}
    </div>
  );
});

ShinyToggle.propTypes = {
  normalSprite: PropTypes.string.isRequired,
  shinySprite: PropTypes.string,
  pokemonName: PropTypes.string.isRequired,
  onToggle: PropTypes.func,
};

ShinyToggle.displayName = 'ShinyToggle';

export default ShinyToggle;

// Separate component for the sprite display with transition
export const ShinySprite = memo(({ normalSprite, shinySprite, isShiny, pokemonName }) => {
  return (
    <div className="relative w-full" style={{ paddingBottom: '100%' }}>
      <AnimatePresence mode="wait">
        <motion.img
          key={isShiny ? 'shiny' : 'normal'}
          src={isShiny ? shinySprite : normalSprite}
          alt={`${pokemonName} ${isShiny ? 'shiny' : 'normal'} sprite`}
          className="absolute inset-0 w-full h-full object-contain"
          initial={{ opacity: 0, rotateY: 90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: -90 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>
    </div>
  );
});

ShinySprite.propTypes = {
  normalSprite: PropTypes.string.isRequired,
  shinySprite: PropTypes.string,
  isShiny: PropTypes.bool.isRequired,
  pokemonName: PropTypes.string.isRequired,
};

ShinySprite.displayName = 'ShinySprite';
