import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import Pokeball from "../ui/Pokeball";

const NAV_LINKS = [
  { name: 'Pokédex', to: '/', icon: '📖' },
  { name: 'Arcade', to: '/arcade', icon: '🕹️' },
];

const SOCIAL_LINKS = [
  { name: 'GitHub', url: 'https://github.com/kaustubh2020/pokedex-neobrutalism-design', icon: '💻' },
  { name: 'Portfolio', url: 'https://kaustubh-folio.netlify.app/', icon: '👑' },
];

const navChipClass = ({ isActive }) =>
  `neo-sticker transition-colors ${
    isActive ? 'bg-neo-black text-neo-yellow' : 'bg-neo-white hover:bg-neo-pink'
  }`;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-neo-yellow border-b-4 border-neo-black sticky top-0 z-50 shadow-neo">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <Pokeball className="w-9 h-9 transition-transform duration-300 group-hover:rotate-180" />
            <span className="font-display text-xl md:text-2xl uppercase">Pokédex</span>
          </Link>

          {/* Desktop: nav links + icon-only socials */}
          <div className="hidden md:flex items-center gap-3">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={navChipClass}>
                <span className="mr-1">{link.icon}</span>
                {link.name}
              </NavLink>
            ))}

            <span className="w-1 h-8 bg-neo-black mx-1" aria-hidden="true" />

            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.name}
                aria-label={link.name}
                className="neo-sticker bg-neo-white hover:bg-neo-blue text-base px-2"
              >
                {link.icon}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="md:hidden neo-sticker bg-neo-white text-lg leading-none"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t-2 border-neo-black overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2 font-bold transition-colors ${
                        isActive ? 'bg-neo-black text-neo-yellow' : 'hover:bg-neo-white'
                      }`
                    }
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.name}
                  </NavLink>
                ))}
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 font-bold hover:bg-neo-white transition-colors"
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
