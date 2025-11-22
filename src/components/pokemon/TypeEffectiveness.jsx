import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from "motion/react";
import { getTypeEffectiveness } from '../../utils/typeEffectiveness';
import { typeColors } from '../../utils/typeColors';

const TypeEffectiveness = memo(({ types }) => {
  const effectiveness = getTypeEffectiveness(types);

  const hasAnyEffectiveness =
    effectiveness.weaknesses.length > 0 ||
    effectiveness.resistances.length > 0 ||
    effectiveness.immunities.length > 0;

  if (!hasAnyEffectiveness) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="neo-card p-4 mt-4"
    >
      <h3 className="text-xl font-bold mb-3 uppercase">Type Effectiveness</h3>

      <div className="space-y-3">
        {/* Weaknesses */}
        {effectiveness.weaknesses.length > 0 && (
          <div>
            <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
              <span className="text-red-600">⚠️ Weak To</span>
              <span className="text-xs opacity-75">
                (takes {effectiveness.weaknesses[0].multiplier}x damage)
              </span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {effectiveness.weaknesses.map(({ type, multiplier }) => (
                <motion.span
                  key={type}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-3 py-1 border-2 border-red-600 font-bold uppercase text-sm shadow-neo"
                  style={{
                    backgroundColor: typeColors[type]?.bg || '#E0E0E0',
                    position: 'relative'
                  }}
                >
                  {type}
                  {multiplier === 4 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1 rounded-full border border-neo-black">
                      4x
                    </span>
                  )}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Resistances */}
        {effectiveness.resistances.length > 0 && (
          <div>
            <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
              <span className="text-green-600">🛡️ Resistant To</span>
              <span className="text-xs opacity-75">
                (takes {effectiveness.resistances[0].multiplier}x damage)
              </span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {effectiveness.resistances.map(({ type, multiplier }) => (
                <motion.span
                  key={type}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-3 py-1 border-2 border-green-600 font-bold uppercase text-sm shadow-neo"
                  style={{
                    backgroundColor: typeColors[type]?.bg || '#E0E0E0',
                    position: 'relative'
                  }}
                >
                  {type}
                  {multiplier === 0.25 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] px-1 rounded-full border border-neo-black">
                      ¼x
                    </span>
                  )}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Immunities */}
        {effectiveness.immunities.length > 0 && (
          <div>
            <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
              <span className="text-gray-600">🚫 Immune To</span>
              <span className="text-xs opacity-75">(takes 0x damage)</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {effectiveness.immunities.map(({ type }) => (
                <motion.span
                  key={type}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-3 py-1 border-2 border-gray-600 font-bold uppercase text-sm shadow-neo opacity-60"
                  style={{ backgroundColor: typeColors[type]?.bg || '#E0E0E0' }}
                >
                  {type}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
});

TypeEffectiveness.propTypes = {
  types: PropTypes.arrayOf(PropTypes.string).isRequired,
};

TypeEffectiveness.displayName = 'TypeEffectiveness';

export default TypeEffectiveness;
