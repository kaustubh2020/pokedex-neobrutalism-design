import PropTypes from 'prop-types';
import Pokeball from './Pokeball';

const Loading = ({ label = 'Catching Pokémon…' }) => (
  <div className="flex flex-col items-center justify-center gap-4 p-12">
    <Pokeball className="w-20 h-20 animate-spin-slow drop-shadow-[4px_4px_0_#16161A]" />
    <p className="font-display uppercase text-lg tracking-wide">{label}</p>
  </div>
);

Loading.propTypes = {
  label: PropTypes.string,
};

export default Loading;
