import { memo } from 'react';
import { motion } from "motion/react";

const SkeletonCard = memo(() => {
  return (
    <div className="neo-card overflow-hidden bg-gray-200 animate-pulse">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b-4 border-gray-300 pb-2">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-12 bg-gray-300 rounded"></div>
        </div>

        {/* Category */}
        <div className="mt-2 h-4 w-32 bg-gray-300 rounded"></div>

        {/* Image Placeholder */}
        <div className="my-4 border-4 border-gray-300 p-2 bg-gray-100 rounded-tl-xl">
          <div className="w-full h-48 bg-gray-300 rounded flex items-center justify-center">
            <span className="text-lg font-bold text-gray-600 text-center px-4">
              Gotta Catch 'Em All!
            </span>
          </div>
        </div>

        {/* Types */}
        <div className="flex gap-2 mb-3">
          <div className="h-8 w-20 bg-gray-300 rounded"></div>
          <div className="h-8 w-20 bg-gray-300 rounded"></div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-3 gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 border border-gray-300 p-1">
              <div className="h-3 w-full bg-gray-300 rounded mb-1"></div>
              <div className="h-4 w-8 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

SkeletonCard.displayName = 'SkeletonCard';

export default SkeletonCard;

// Skeleton Grid for multiple cards
export const SkeletonGrid = memo(({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={`skeleton-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <SkeletonCard />
        </motion.div>
      ))}
    </div>
  );
});

SkeletonGrid.displayName = 'SkeletonGrid';
