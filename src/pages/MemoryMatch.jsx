import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Pokeball from '../components/ui/Pokeball';

const PAIRS = 6;
const GEN1_MAX = 151;

const artUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const dealCards = () => {
  const ids = new Set();
  while (ids.size < PAIRS) ids.add(1 + Math.floor(Math.random() * GEN1_MAX));
  return [...ids, ...ids]
    .map((id, i) => ({ uid: i, id }))
    .sort(() => Math.random() - 0.5);
};

const MemoryMatch = () => {
  const [phase, setPhase] = useState('intro'); // intro | play | won
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // uids currently face-up (max 2)
  const [matched, setMatched] = useState(new Set()); // matched pokemon ids
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [bestMoves, setBestMoves] = useState(() =>
    parseInt(localStorage.getItem('memory-best') || '0')
  );
  const lockRef = useRef(false);

  const startGame = () => {
    setCards(dealCards());
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setSeconds(0);
    lockRef.current = false;
    setPhase('play');
  };

  // Game clock
  useEffect(() => {
    if (phase !== 'play') return;
    const iv = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, [phase]);

  const flip = (card) => {
    if (phase !== 'play' || lockRef.current || flipped.length >= 2) return;
    if (flipped.includes(card.uid) || matched.has(card.id)) return;

    const next = [...flipped, card.uid];
    setFlipped(next);
    if (next.length < 2) return;

    setMoves((m) => m + 1);
    lockRef.current = true;
    const [a, b] = next.map((uid) => cards.find((c) => c.uid === uid));
    if (a.id === b.id) {
      setTimeout(() => {
        setMatched((prev) => new Set(prev).add(a.id));
        setFlipped([]);
        lockRef.current = false;
      }, 450);
    } else {
      setTimeout(() => {
        setFlipped([]);
        lockRef.current = false;
      }, 950);
    }
  };

  // Win detection
  useEffect(() => {
    if (phase === 'play' && matched.size === PAIRS) {
      setPhase('won');
      setBestMoves((old) => {
        const newBest = old === 0 ? moves : Math.min(old, moves);
        localStorage.setItem('memory-best', String(newBest));
        return newBest;
      });
    }
  }, [matched, phase, moves]);

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/arcade" className="neo-sticker bg-neo-white inline-block mb-4 hover:bg-neo-yellow">
        ← Arcade
      </Link>

      <div className="relative border-4 border-neo-black bg-neo-green shadow-neo-xl overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(#16161A 1.5px, transparent 1.5px)',
            backgroundSize: '16px 16px',
          }}
        />

        {phase === 'intro' && (
          <div className="relative px-6 py-16 text-center">
            <motion.div
              animate={{ rotateY: [0, 180, 360] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-24 h-24 mx-auto mb-6"
            >
              <Pokeball className="w-24 h-24" />
            </motion.div>
            <h1 className="text-3xl md:text-5xl uppercase [text-shadow:4px_4px_0_#FFFFFF]">
              Pokéball Memory
            </h1>
            <p className="mt-4 font-mono font-bold text-sm max-w-md mx-auto">
              {PAIRS} pairs hide under the Pokéballs. Match them all in the fewest
              moves! {bestMoves > 0 && `Your best: ${bestMoves} moves.`}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="neo-button bg-neo-red text-lg mt-8"
            >
              🧠 Start matching
            </motion.button>
          </div>
        )}

        {(phase === 'play' || phase === 'won') && (
          <div className="relative px-4 py-6">
            {/* HUD */}
            <div className="flex justify-center gap-3 mb-6">
              <span className="neo-sticker bg-neo-white text-sm">🎯 {moves} moves</span>
              <span className="neo-sticker bg-neo-yellow text-sm">
                ⏱️ {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
              </span>
              <span className="neo-sticker bg-neo-pink text-sm">
                {matched.size}/{PAIRS} pairs
              </span>
            </div>

            {/* Board */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
              {cards.map((card, i) => {
                const isUp = flipped.includes(card.uid) || matched.has(card.id);
                const isMatched = matched.has(card.id);
                return (
                  <motion.button
                    key={card.uid}
                    initial={{ scale: 0, rotate: -8 }}
                    animate={isMatched ? { scale: [1, 1.12, 1], rotate: 0 } : { scale: 1, rotate: 0 }}
                    transition={isMatched ? { duration: 0.4 } : { delay: i * 0.04, type: 'spring', stiffness: 200 }}
                    onClick={() => flip(card)}
                    disabled={isUp || phase === 'won'}
                    className="perspective-600 aspect-[3/4] cursor-pointer disabled:cursor-default"
                    aria-label={isUp ? `Card ${card.uid}, face up` : `Card ${card.uid}, face down`}
                  >
                    <div
                      className={`relative w-full h-full preserve-3d transition-transform duration-500 ${
                        isUp ? 'rotate-y-180' : ''
                      }`}
                    >
                      {/* Back (pokéball, face-down side) */}
                      <div className="absolute inset-0 backface-hidden bg-neo-black border-4 border-neo-black shadow-neo rounded-tl-lg flex items-center justify-center hover:shadow-neo-lg transition-shadow">
                        <Pokeball className="w-10 h-10 md:w-12 md:h-12" />
                      </div>
                      {/* Front (the Pokémon) */}
                      <div
                        className={`absolute inset-0 backface-hidden rotate-y-180 border-4 shadow-neo rounded-tl-lg flex items-center justify-center p-1 ${
                          isMatched ? 'bg-neo-yellow border-neo-black ring-4 ring-neo-white' : 'bg-neo-white border-neo-black'
                        }`}
                      >
                        <img src={artUrl(card.id)} alt="Pokémon card" className="w-full h-full object-contain" draggable="false" />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Win overlay */}
            {phase === 'won' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 150 }}
                className="text-center mt-8"
              >
                <h2 className="text-3xl md:text-4xl uppercase [text-shadow:3px_3px_0_#FFFFFF]">
                  All pairs caught! 🎉
                </h2>
                <p className="mt-2 font-mono font-bold text-sm">
                  {moves} moves in {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')} — best: {bestMoves} moves
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="neo-button bg-neo-red text-lg mt-6"
                >
                  🔄 New board
                </motion.button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryMatch;
