import PropTypes from 'prop-types';

/**
 * Inline Pokéball SVG — the signature asset of the redesign.
 * Used in the navbar logo, loaders, hero decorations and card watermarks.
 */
const Pokeball = ({ className = 'w-8 h-8', mono = false }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <circle cx="50" cy="50" r="46" fill={mono ? 'currentColor' : '#FFFFFF'} stroke="#16161A" strokeWidth="7" />
    {!mono && <path d="M4 50 a46 46 0 0 1 92 0 Z" fill="#EE1515" stroke="#16161A" strokeWidth="7" />}
    <rect x="4" y="45" width="92" height="10" fill="#16161A" />
    <circle cx="50" cy="50" r="16" fill={mono ? 'currentColor' : '#FFFFFF'} stroke="#16161A" strokeWidth="7" />
    <circle cx="50" cy="50" r="6" fill="#16161A" />
  </svg>
);

Pokeball.propTypes = {
  className: PropTypes.string,
  mono: PropTypes.bool,
};

export default Pokeball;
