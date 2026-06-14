import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Pokeball from '../components/ui/Pokeball';

const GAMES = [
  {
    to: '/arcade/clash',
    title: 'Stat Clash',
    emoji: '⚔️',
    bg: 'bg-neo-red',
    text: 'text-neo-white',
    desc: 'Best-of-5 card duel vs the CPU. Type advantage, mood tells, and ties go to you.',
    badge: 'VS CPU',
  },
  {
    to: '/arcade/guess',
    title: "Who's That Pokémon?",
    emoji: '❓',
    bg: 'bg-neo-blue',
    text: 'text-neo-white',
    desc: 'Name the silhouette before the timer hits zero. 3 lives — chase your best streak.',
    badge: 'QUIZ',
  },
  {
    to: '/arcade/memory',
    title: 'Pokéball Memory',
    emoji: '🧠',
    bg: 'bg-neo-green',
    text: 'text-neo-black',
    desc: 'Six pairs hide under the Pokéballs. Match them all in the fewest moves.',
    badge: 'PUZZLE',
  },
];

const Arcade = () => (
  <div className="max-w-5xl mx-auto">
    {/* Header */}
    <div className="text-center mb-10 relative">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        <span className="neo-sticker bg-neo-pink rotate-3 inline-block mb-3">Insert coin 🪙</span>
        <h1 className="text-5xl md:text-7xl uppercase [text-shadow:5px_5px_0_#FFDE00,10px_10px_0_#16161A]">
          Arcade
        </h1>
        <p className="mt-3 font-mono font-bold">Three games. Zero quarters needed.</p>
      </motion.div>
      <Pokeball className="absolute -top-4 right-4 w-14 h-14 animate-spin-slow hidden md:block" />
      <Pokeball className="absolute top-8 left-2 w-9 h-9 animate-float hidden md:block" />
    </div>

    {/* Game tiles */}
    <div className="grid md:grid-cols-3 gap-6">
      {GAMES.map((game, i) => (
        <motion.div
          key={game.to}
          initial={{ y: 60, opacity: 0, rotate: i % 2 ? 2 : -2 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ delay: i * 0.12, type: 'spring', stiffness: 120 }}
        >
          <Link to={game.to} className="block group">
            <motion.div
              whileHover={{ y: -8, rotate: i % 2 ? 1.5 : -1.5 }}
              whileTap={{ scale: 0.97 }}
              className={`relative border-4 border-neo-black shadow-neo-lg group-hover:shadow-neo-xl
                transition-shadow overflow-hidden ${game.bg} ${game.text} p-6 h-full`}
            >
              <Pokeball
                mono
                className="absolute -right-8 -bottom-8 w-32 h-32 opacity-15 transition-transform duration-500 group-hover:rotate-90"
              />
              <span className="neo-sticker bg-neo-yellow text-neo-black text-xs absolute top-3 right-3 rotate-3">
                {game.badge}
              </span>

              <motion.div
                className="text-5xl mb-4"
                whileHover={{ rotate: [0, -12, 12, 0] }}
                transition={{ duration: 0.4 }}
              >
                {game.emoji}
              </motion.div>
              <h2 className="font-display text-xl uppercase leading-tight mb-2">{game.title}</h2>
              <p className="font-bold text-sm opacity-90 mb-6">{game.desc}</p>

              <span className="neo-sticker bg-neo-white text-neo-black group-hover:bg-neo-yellow transition-colors">
                Play ▶
              </span>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Arcade;
