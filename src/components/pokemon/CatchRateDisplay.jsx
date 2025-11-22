import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from "motion/react";

const CatchRateDisplay = memo(({ species, baseExperience }) => {
  if (!species) return null;

  const catchRate = species.capture_rate || 0;
  const growthRate = species.growth_rate?.name || 'unknown';

  // Calculate catch percentage (approximate)
  // Formula: (catchRate / 255) * 100
  const catchPercentage = Math.round((catchRate / 255) * 100);

  // Format growth rate for display
  const formatGrowthRate = (rate) => {
    return rate
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get color based on catch rate
  const getCatchRateColor = (rate) => {
    if (rate >= 200) return '#4ade80'; // Easy - green
    if (rate >= 100) return '#facc15'; // Medium - yellow
    if (rate >= 45) return '#fb923c';  // Hard - orange
    return '#ef4444'; // Very hard - red
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="neo-card p-4 mt-4"
    >
      <h3 className="text-xl font-bold mb-3 uppercase">Catch Info</h3>

      <div className="space-y-3">
        {/* Catch Rate */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-bold">Catch Rate</span>
            <span className="text-sm font-bold">
              {catchRate}/255 ({catchPercentage}%)
            </span>
          </div>
          <div className="h-4 bg-neo-white border-2 border-neo-black overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${catchPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full"
              style={{ backgroundColor: getCatchRateColor(catchRate) }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {catchRate >= 200 && '🟢 Very Easy to Catch'}
            {catchRate >= 100 && catchRate < 200 && '🟡 Moderate Catch Rate'}
            {catchRate >= 45 && catchRate < 100 && '🟠 Hard to Catch'}
            {catchRate < 45 && '🔴 Very Hard to Catch'}
          </p>
        </div>

        {/* Base Experience & Growth Rate */}
        <div className="grid grid-cols-2 gap-3">
          <div className="neo-card p-3 bg-neo-white">
            <div className="text-xs font-bold text-gray-600 mb-1">
              BASE EXP
            </div>
            <div className="text-2xl font-black">
              {baseExperience || 'N/A'}
            </div>
          </div>

          <div className="neo-card p-3 bg-neo-white">
            <div className="text-xs font-bold text-gray-600 mb-1">
              GROWTH RATE
            </div>
            <div className="text-sm font-black uppercase">
              {formatGrowthRate(growthRate)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

CatchRateDisplay.propTypes = {
  species: PropTypes.shape({
    capture_rate: PropTypes.number,
    growth_rate: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  baseExperience: PropTypes.number,
};

CatchRateDisplay.displayName = 'CatchRateDisplay';

export default CatchRateDisplay;
