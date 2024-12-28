import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/kaustubh2020', icon: '💻' },
    { name: 'Portfolio', url: 'https://kaustubh-folio.netlify.app/', icon: '👑' },
  ];

  return (
    <nav className="bg-neo-white border-b-4 border-neo-black sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-black uppercase hover:text-neo-blue transition-colors"
          >
            <img src="" alt="" />
            Pokédex
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 hover:bg-neo-yellow border-2 border-transparent
                         hover:border-neo-black transition-all duration-200 rounded-md"
              >
                <span className="mr-2">{link.icon}</span>
                {link.name}
              </a>
            ))}
            <span className="text-sm px-2 py-1 bg-neo-pink border-2 border-neo-black rounded-md text-neo-black">Made with 💛 by Kaustubh Jaiswal</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-neo-yellow rounded-md"
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
              className="md:hidden border-t-2 border-neo-black"
            >
              <div className="py-4 space-y-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 hover:bg-neo-yellow transition-colors"
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.name}
                  </a>
                ))}
                <div className="px-4 py-2 text-sm text-center bg-neo-pink border-2 border-neo-black rounded-md">
                  Made with 💛 by Kaustubh Jaiswal
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div >
    </nav >
  );
};

export default Navbar;