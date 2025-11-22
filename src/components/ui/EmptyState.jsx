import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from "motion/react";

const EmptyState = memo(({
  icon = '🔍',
  title = 'No Results Found',
  message = 'Try adjusting your filters or search term.',
  onClearFilters,
  showClearButton = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="text-8xl mb-4"
      >
        {icon}
      </motion.div>

      <h3 className="text-2xl font-black uppercase mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">{message}</p>

      {showClearButton && onClearFilters && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClearFilters}
          className="neo-button"
        >
          Clear All Filters
        </motion.button>
      )}
    </motion.div>
  );
});

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
  onClearFilters: PropTypes.func,
  showClearButton: PropTypes.bool,
};

EmptyState.displayName = 'EmptyState';

export default EmptyState;
