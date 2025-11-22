import { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion } from "motion/react";

const Breadcrumbs = memo(({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-center">
              {!isLast ? (
                <>
                  <Link
                    to={item.href}
                    className="font-bold hover:text-neo-blue transition-colors underline"
                  >
                    {item.label}
                  </Link>
                  <span className="mx-2 font-bold">/</span>
                </>
              ) : (
                <span className="font-bold text-gray-600" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ).isRequired,
};

Breadcrumbs.displayName = 'Breadcrumbs';

export default Breadcrumbs;
