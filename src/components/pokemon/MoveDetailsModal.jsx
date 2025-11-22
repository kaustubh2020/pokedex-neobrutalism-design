import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from "motion/react";
import { typeColors } from '../../utils/typeColors';

const MoveDetailsModal = memo(({ move, isOpen, onClose }) => {
  if (!isOpen || !move) return null;

  // Get effect description
  const effectText = move.effect_entries?.find(e => e.language.name === 'en')?.effect ||
    move.effect_entries?.[0]?.effect ||
    'No description available.';

  // Format effect text (replace $effect_chance$ with actual value)
  const formattedEffect = effectText.replace(/\$effect_chance\$/g, move.effect_chance || '');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="neo-card p-6 bg-neo-white max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-black uppercase">
                  {move.name.replace(/-/g, ' ')}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-2xl font-bold hover:text-red-600 transition-colors"
                  aria-label="Close modal"
                >
                  ✕
                </motion.button>
              </div>

              {/* Type and Category */}
              <div className="flex gap-2 mb-4">
                <span
                  className="px-4 py-2 border-2 border-neo-black font-bold uppercase shadow-neo"
                  style={{ backgroundColor: typeColors[move.type.name]?.bg || '#E0E0E0' }}
                >
                  {move.type.name}
                </span>
                <span className="px-4 py-2 border-2 border-neo-black font-bold uppercase bg-gray-200 shadow-neo">
                  {move.damage_class.name}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="neo-card p-3 bg-neo-yellow">
                  <div className="text-xs font-bold text-gray-600 mb-1">POWER</div>
                  <div className="text-2xl font-black">{move.power || '—'}</div>
                </div>
                <div className="neo-card p-3 bg-neo-pink">
                  <div className="text-xs font-bold text-gray-600 mb-1">ACCURACY</div>
                  <div className="text-2xl font-black">{move.accuracy || '—'}</div>
                </div>
                <div className="neo-card p-3 bg-neo-blue text-white">
                  <div className="text-xs font-bold mb-1">PP</div>
                  <div className="text-2xl font-black">{move.pp}</div>
                </div>
                <div className="neo-card p-3 bg-purple-300">
                  <div className="text-xs font-bold text-gray-600 mb-1">PRIORITY</div>
                  <div className="text-2xl font-black">{move.priority}</div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="neo-card p-3 bg-neo-white">
                  <div className="text-xs font-bold text-gray-600 mb-1">TARGET</div>
                  <div className="text-sm font-bold uppercase">
                    {move.target?.name.replace(/-/g, ' ') || 'N/A'}
                  </div>
                </div>
                {move.effect_chance && (
                  <div className="neo-card p-3 bg-neo-white">
                    <div className="text-xs font-bold text-gray-600 mb-1">EFFECT CHANCE</div>
                    <div className="text-sm font-bold">{move.effect_chance}%</div>
                  </div>
                )}
              </div>

              {/* Effect Description */}
              <div className="neo-card p-4 bg-gray-50">
                <h3 className="text-sm font-bold mb-2 uppercase">Effect</h3>
                <p className="text-sm leading-relaxed">{formattedEffect}</p>
              </div>

              {/* Flavor Text */}
              {move.flavor_text_entries && move.flavor_text_entries.length > 0 && (
                <div className="mt-4 neo-card p-4 bg-gray-50">
                  <h3 className="text-sm font-bold mb-2 uppercase">Description</h3>
                  <p className="text-sm italic">
                    "{move.flavor_text_entries.find(e => e.language.name === 'en')?.flavor_text ||
                      move.flavor_text_entries[0]?.flavor_text}"
                  </p>
                </div>
              )}

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full mt-4 neo-button"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

MoveDetailsModal.propTypes = {
  move: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.shape({
      name: PropTypes.string,
    }),
    damage_class: PropTypes.shape({
      name: PropTypes.string,
    }),
    power: PropTypes.number,
    accuracy: PropTypes.number,
    pp: PropTypes.number,
    priority: PropTypes.number,
    effect_chance: PropTypes.number,
    target: PropTypes.shape({
      name: PropTypes.string,
    }),
    effect_entries: PropTypes.arrayOf(
      PropTypes.shape({
        effect: PropTypes.string,
        language: PropTypes.shape({
          name: PropTypes.string,
        }),
      })
    ),
    flavor_text_entries: PropTypes.arrayOf(
      PropTypes.shape({
        flavor_text: PropTypes.string,
        language: PropTypes.shape({
          name: PropTypes.string,
        }),
      })
    ),
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

MoveDetailsModal.displayName = 'MoveDetailsModal';

export default MoveDetailsModal;
