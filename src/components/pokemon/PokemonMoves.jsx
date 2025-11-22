/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { getMoveDetails } from '../../utils/api';
import { typeColors } from '../../utils/typeColors';
import Loading from "../ui/Loading";

const PokemonMoves = ({ pokemon }) => {
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState('level-up');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const fetchMoves = async () => {
      setLoading(true);
      try {
        // Limit to first 20 moves to avoid too many API calls
        const movePromises = pokemon.moves
          .slice(0, 20)
          .map(move => getMoveDetails(move.move.url));

        const moveDetails = await Promise.all(movePromises);

        // Combine move details with learn method info
        const movesWithMethod = moveDetails.map((detail, index) => ({
          ...detail,
          learnMethods: pokemon.moves[index].version_group_details
        }));

        setMoves(movesWithMethod);
      } catch (error) {
        console.error('Error fetching moves:', error);
      } finally {
        setLoading(false);
      }
    };

    if (pokemon?.moves) {
      fetchMoves();
    }
  }, [pokemon]);

  if (loading) return <Loading />;
  if (moves.length === 0) return null;

  // Filter moves by learn method
  const filteredByMethod = moves.filter(move =>
    move.learnMethods.some(method =>
      method.move_learn_method.name === selectedMethod
    )
  );

  // Filter by type
  const filteredMoves = selectedType === 'all'
    ? filteredByMethod
    : filteredByMethod.filter(move => move.type.name === selectedType);

  // Get unique types from moves
  const moveTypes = [...new Set(moves.map(m => m.type.name))];

  const learnMethods = [
    { id: 'level-up', label: 'Level Up' },
    { id: 'machine', label: 'TM/HM' },
    { id: 'egg', label: 'Egg Moves' },
    { id: 'tutor', label: 'Tutor' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 neo-card p-6"
    >
      <h3 className="text-2xl font-bold mb-4 uppercase">Moves</h3>

      {/* Learn Method Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {learnMethods.map(method => (
          <motion.button
            key={method.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMethod(method.id)}
            className={`px-4 py-2 border-2 border-neo-black font-bold uppercase transition-all ${selectedMethod === method.id
                ? 'bg-neo-pink shadow-neo-lg'
                : 'bg-neo-white shadow-neo hover:shadow-neo-lg'
              }`}
          >
            {method.label}
          </motion.button>
        ))}
      </div>

      {/* Type Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedType('all')}
          className={`px-3 py-1 border-2 border-neo-black font-bold uppercase text-sm ${selectedType === 'all'
              ? 'bg-neo-yellow shadow-neo-lg'
              : 'bg-neo-white shadow-neo'
            }`}
        >
          All Types
        </motion.button>
        {moveTypes.map(type => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1 border-2 border-neo-black font-bold uppercase text-sm ${selectedType === type ? 'shadow-neo-lg' : 'shadow-neo'
              }`}
            style={{
              backgroundColor: typeColors[type]?.bg || '#E0E0E0',
              opacity: selectedType === type ? 1 : 0.7
            }}
          >
            {type}
          </motion.button>
        ))}
      </div>

      {/* Moves Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AnimatePresence>
          {filteredMoves.map((move, index) => {
            const levelLearned = move.learnMethods
              .find(m => m.move_learn_method.name === selectedMethod)
              ?.level_learned_at;

            return (
              <motion.div
                key={move.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="neo-card p-3 bg-neo-white"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold uppercase text-sm">
                    {move.name.replace('-', ' ')}
                  </h4>
                  {levelLearned > 0 && (
                    <span className="text-xs bg-neo-yellow border border-neo-black px-2 py-1 font-bold">
                      Lv. {levelLearned}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-2 py-1 border border-neo-black text-xs font-bold uppercase"
                    style={{ backgroundColor: typeColors[move.type.name]?.bg || '#E0E0E0' }}
                  >
                    {move.type.name}
                  </span>
                  <span className="px-2 py-1 border border-neo-black text-xs font-bold bg-gray-200">
                    {move.damage_class.name}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="font-bold">Power</div>
                    <div>{move.power || '-'}</div>
                  </div>
                  <div>
                    <div className="font-bold">Accuracy</div>
                    <div>{move.accuracy || '-'}</div>
                  </div>
                  <div>
                    <div className="font-bold">PP</div>
                    <div>{move.pp}</div>
                  </div>
                </div>

                {move.effect_entries?.[0]?.short_effect && (
                  <p className="text-xs mt-2 opacity-75">
                    {move.effect_entries[0].short_effect}
                  </p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredMoves.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No moves found for this method/type combination.
        </div>
      )}
    </motion.div>
  );
};

export default PokemonMoves;
