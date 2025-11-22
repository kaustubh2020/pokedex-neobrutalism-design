// Type effectiveness chart based on Pokémon type matchups
// Returns multipliers for attacking types against defending types

const typeChart = {
  normal: {
    weaknesses: ['fighting'],
    resistances: [],
    immunities: ['ghost']
  },
  fire: {
    weaknesses: ['water', 'ground', 'rock'],
    resistances: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
    immunities: []
  },
  water: {
    weaknesses: ['electric', 'grass'],
    resistances: ['fire', 'water', 'ice', 'steel'],
    immunities: []
  },
  grass: {
    weaknesses: ['fire', 'ice', 'poison', 'flying', 'bug'],
    resistances: ['water', 'electric', 'grass', 'ground'],
    immunities: []
  },
  electric: {
    weaknesses: ['ground'],
    resistances: ['electric', 'flying', 'steel'],
    immunities: []
  },
  ice: {
    weaknesses: ['fire', 'fighting', 'rock', 'steel'],
    resistances: ['ice'],
    immunities: []
  },
  fighting: {
    weaknesses: ['flying', 'psychic', 'fairy'],
    resistances: ['bug', 'rock', 'dark'],
    immunities: []
  },
  poison: {
    weaknesses: ['ground', 'psychic'],
    resistances: ['grass', 'fighting', 'poison', 'bug', 'fairy'],
    immunities: []
  },
  ground: {
    weaknesses: ['water', 'grass', 'ice'],
    resistances: ['poison', 'rock'],
    immunities: ['electric']
  },
  flying: {
    weaknesses: ['electric', 'ice', 'rock'],
    resistances: ['grass', 'fighting', 'bug'],
    immunities: ['ground']
  },
  psychic: {
    weaknesses: ['bug', 'ghost', 'dark'],
    resistances: ['fighting', 'psychic'],
    immunities: []
  },
  bug: {
    weaknesses: ['fire', 'flying', 'rock'],
    resistances: ['grass', 'fighting', 'ground'],
    immunities: []
  },
  rock: {
    weaknesses: ['water', 'grass', 'fighting', 'ground', 'steel'],
    resistances: ['normal', 'fire', 'poison', 'flying'],
    immunities: []
  },
  ghost: {
    weaknesses: ['ghost', 'dark'],
    resistances: ['poison', 'bug'],
    immunities: ['normal', 'fighting']
  },
  dragon: {
    weaknesses: ['ice', 'dragon', 'fairy'],
    resistances: ['fire', 'water', 'electric', 'grass'],
    immunities: []
  },
  dark: {
    weaknesses: ['fighting', 'bug', 'fairy'],
    resistances: ['ghost', 'dark'],
    immunities: ['psychic']
  },
  steel: {
    weaknesses: ['fire', 'fighting', 'ground'],
    resistances: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'],
    immunities: ['poison']
  },
  fairy: {
    weaknesses: ['poison', 'steel'],
    resistances: ['fighting', 'bug', 'dark'],
    immunities: ['dragon']
  }
};

/**
 * Calculate type effectiveness for a Pokémon based on its types
 * @param {Array<string>} types - Array of Pokémon types (e.g., ['grass', 'poison'])
 * @returns {Object} Object containing weaknesses, resistances, and immunities with multipliers
 */
export const getTypeEffectiveness = (types) => {
  const effectiveness = {};

  // Initialize all types with 1x multiplier
  Object.keys(typeChart).forEach(type => {
    effectiveness[type] = 1;
  });

  // Calculate combined effectiveness for all Pokémon types
  types.forEach(defenseType => {
    const typeData = typeChart[defenseType.toLowerCase()];
    if (!typeData) return;

    // Apply weaknesses (2x damage)
    typeData.weaknesses.forEach(attackType => {
      effectiveness[attackType] *= 2;
    });

    // Apply resistances (0.5x damage)
    typeData.resistances.forEach(attackType => {
      effectiveness[attackType] *= 0.5;
    });

    // Apply immunities (0x damage)
    typeData.immunities.forEach(attackType => {
      effectiveness[attackType] = 0;
    });
  });

  // Categorize by effectiveness
  const result = {
    weaknesses: [], // 2x or 4x damage
    resistances: [], // 0.5x or 0.25x damage
    immunities: []   // 0x damage
  };

  Object.entries(effectiveness).forEach(([type, multiplier]) => {
    if (multiplier === 0) {
      result.immunities.push({ type, multiplier });
    } else if (multiplier > 1) {
      result.weaknesses.push({ type, multiplier });
    } else if (multiplier < 1) {
      result.resistances.push({ type, multiplier });
    }
  });

  // Sort by multiplier (highest first)
  result.weaknesses.sort((a, b) => b.multiplier - a.multiplier);
  result.resistances.sort((a, b) => a.multiplier - b.multiplier);

  return result;
};
