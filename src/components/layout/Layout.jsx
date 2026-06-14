import PropTypes from 'prop-types';
import Navbar from "./Navbar";
import ScrollToTop from "../ui/ScrollToTop";
import Pokeball from "../ui/Pokeball";

const MARQUEE_ITEMS = Array.from({ length: 10 });

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-1 w-full">{children}</main>

      {/* Marquee footer */}
      <footer className="bg-neo-black text-neo-yellow border-t-4 border-neo-black overflow-hidden py-3">
        <p className="text-center text-xs font-bold text-neo-white mb-2">
          Made with 💛 by{' '}
          <a
            href="https://kaustubh-folio.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-neo-yellow decoration-2 hover:text-neo-yellow"
          >
            Kaustubh Jaiswal
          </a>
        </p>
        <div className="flex w-max animate-marquee gap-8 font-display uppercase text-sm tracking-widest">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
              {MARQUEE_ITEMS.map((_, i) => (
                <span key={i} className="flex items-center gap-8 whitespace-nowrap">
                  Gotta catch &apos;em all
                  <Pokeball className="w-5 h-5" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default Layout;
