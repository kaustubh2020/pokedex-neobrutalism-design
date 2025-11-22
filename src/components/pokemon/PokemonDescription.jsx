import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from "motion/react";

const PokemonDescription = memo(({ species }) => {
  if (!species?.flavor_text_entries) return null;

  // Get English flavor text from the most recent game
  const englishEntries = species.flavor_text_entries.filter(
    entry => entry.language.name === 'en'
  );

  if (englishEntries.length === 0) return null;

  // Get the latest entry (usually the last one in the array)
  const latestEntry = englishEntries[englishEntries.length - 1];

  // Clean up the text (remove form feeds and extra spaces)
  const description = latestEntry.flavor_text
    .replace(/\f/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Get genus (e.g., "Seed Pokémon")
  const genus = species.genera?.find(g => g.language.name === 'en')?.genus || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="neo-card p-4 mt-4"
    >
      <h3 className="text-xl font-bold mb-2 uppercase">Pokédex Entry</h3>

      {genus && (
        <p className="text-sm font-bold text-gray-600 mb-2 italic">
          {genus}
        </p>
      )}

      <p className="text-base leading-relaxed">
        "{description}"
      </p>

      {latestEntry.version && (
        <p className="text-xs text-gray-500 mt-2 uppercase">
          — {latestEntry.version.name.replace('-', ' ')}
        </p>
      )}
    </motion.div>
  );
});

PokemonDescription.propTypes = {
  species: PropTypes.shape({
    flavor_text_entries: PropTypes.arrayOf(
      PropTypes.shape({
        flavor_text: PropTypes.string,
        language: PropTypes.shape({
          name: PropTypes.string,
        }),
        version: PropTypes.shape({
          name: PropTypes.string,
        }),
      })
    ),
    genera: PropTypes.arrayOf(
      PropTypes.shape({
        genus: PropTypes.string,
        language: PropTypes.shape({
          name: PropTypes.string,
        }),
      })
    ),
  }),
};

PokemonDescription.displayName = 'PokemonDescription';

export default PokemonDescription;
