import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from "motion/react";
import { typeColors } from "../../utils/typeColors";

const TypeFilter = memo(({ selectedTypes, onTypeToggle, onClearFilters }) => {
  const allTypes = Object.keys(typeColors);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold uppercase">Filter by Type</h3>
        {selectedTypes.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClearFilters}
            className="px-3 py-1 text-sm border-2 border-neo-black bg-neo-pink font-bold uppercase shadow-neo hover:shadow-neo-lg transition-all"
          >
            Clear ({selectedTypes.length})
          </motion.button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {allTypes.map((type) => {
          const isSelected = selectedTypes.includes(type);
          const colors = typeColors[type];

          return (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTypeToggle(type)}
              className={`px-4 py-2 border-2 border-neo-black font-bold uppercase transition-all ${isSelected
                  ? 'shadow-neo-lg'
                  : 'shadow-neo hover:shadow-neo-lg'
                }`}
              style={{
                backgroundColor: colors.bg,
                opacity: isSelected ? 1 : 0.6,
                transform: isSelected ? 'translateY(-2px)' : 'translateY(0)'
              }}
            >
              {type}
              {isSelected && ' ✓'}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

TypeFilter.propTypes = {
  selectedTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTypeToggle: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
};

TypeFilter.displayName = 'TypeFilter';

export default TypeFilter;
