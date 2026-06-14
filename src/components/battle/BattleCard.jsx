import PropTypes from 'prop-types';
import { motion } from 'motion/react';
import { typeColors } from '../../utils/typeColors';
import Pokeball from '../ui/Pokeball';

import { STAT_KEYS, getStat } from './battleUtils';

/** Face-down card back — a giant pokéball on black. */
export const CardBack = ({ small = false }) => (
  <div
    className={`${small ? 'w-16 h-24' : 'w-36 h-52 md:w-44 md:h-60'}
      bg-neo-black border-4 border-neo-black shadow-neo rounded-tl-xl
      flex items-center justify-center overflow-hidden relative`}
  >
    <div className="absolute inset-1 border-2 border-neo-yellow/40 rounded-tl-lg" />
    <Pokeball className={small ? 'w-10 h-10' : 'w-20 h-20'} />
  </div>
);

CardBack.propTypes = { small: PropTypes.bool };

/** Face-up battle card with artwork + the four battle stats. */
const BattleCard = ({ pokemon, highlightStat, onClick, disabled = false, dimmed = false }) => {
  const mainType = pokemon.types[0].type.name;
  const colors = typeColors[mainType] ?? typeColors.normal;
  const Wrapper = onClick ? motion.button : motion.div;

  return (
    <Wrapper
      onClick={onClick}
      disabled={onClick ? disabled : undefined}
      whileHover={onClick && !disabled ? { y: -10, rotate: -1.5 } : undefined}
      whileTap={onClick && !disabled ? { scale: 0.95 } : undefined}
      className={`w-36 md:w-44 text-left border-4 border-neo-black shadow-neo rounded-tl-xl overflow-hidden
        transition-opacity ${dimmed ? 'opacity-40' : ''} ${onClick && !disabled ? 'cursor-pointer hover:shadow-neo-lg' : ''}`}
      style={{ backgroundColor: colors.highlight }}
    >
      <div className="px-2 pt-1.5 pb-1 flex justify-between items-center border-b-2 border-neo-black bg-neo-white/60">
        <span className="font-display text-[11px] md:text-xs uppercase truncate">{pokemon.name}</span>
      </div>

      <div className="relative bg-neo-white border-b-2 border-neo-black">
        <Pokeball className="absolute -bottom-3 -right-3 w-14 h-14 opacity-10" />
        <img
          src={pokemon.sprites?.other?.['official-artwork']?.front_default}
          alt={pokemon.name}
          className="w-full h-24 md:h-28 object-contain relative"
          draggable="false"
        />
        <span
          className="absolute top-1 left-1 text-[9px] font-bold uppercase border border-neo-black px-1"
          style={{ backgroundColor: colors.bg }}
        >
          {mainType}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-px bg-neo-black">
        {STAT_KEYS.map(({ key, label, icon }) => (
          <div
            key={key}
            className={`px-1.5 py-1 text-[11px] font-mono font-bold flex justify-between
              ${highlightStat === key ? 'bg-neo-yellow' : 'bg-neo-white'}`}
          >
            <span>{icon} {label}</span>
            <span>{getStat(pokemon, key)}</span>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

BattleCard.propTypes = {
  pokemon: PropTypes.object.isRequired,
  highlightStat: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  dimmed: PropTypes.bool,
};

export default BattleCard;
