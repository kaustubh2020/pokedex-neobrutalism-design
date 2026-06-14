export const STAT_KEYS = [
  { key: 'hp', label: 'HP', icon: '❤️' },
  { key: 'attack', label: 'ATK', icon: '⚔️' },
  { key: 'defense', label: 'DEF', icon: '🛡️' },
  { key: 'speed', label: 'SPD', icon: '⚡' },
];

export const getStat = (pokemon, key) =>
  pokemon.stats.find((s) => s.stat.name === key)?.base_stat ?? 0;
