import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { pokemonList } from '../data/pokemonList';
import Pokeball from '../components/ui/Pokeball';

const GEN1 = pokemonList
  .map((p) => ({ id: parseInt(p.url.split('/')[6]), name: p.name }))
  .filter((p) => p.id <= 151);

const artUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const TIME_LIMIT = 10; // seconds per guess
const MAX_LIVES = 3;

const pickQuestion = () => {
  const pool = [...GEN1].sort(() => Math.random() - 0.5).slice(0, 4);
  return { answer: pool[Math.floor(Math.random() * 4)], options: pool };
};

const WhosThat = () => {
  const [phase, setPhase] = useState('intro'); // intro | guess | reveal | over
  const [q, setQ] = useState(null);
  const [roundNum, setRoundNum] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('whosthat-best') || '0'));
  const [picked, setPicked] = useState(null); // name the player chose (null = timeout)
  // separate refs: phase-change cleanup must not kill the auto-advance timer
  const countdownRef = useRef(null);
  const advanceRef = useRef(null);

  const nextQuestion = useCallback(() => {
    setQ(pickQuestion());
    setPicked(null);
    setRoundNum((r) => r + 1);
    setPhase('guess');
  }, []);

  const startGame = () => {
    setLives(MAX_LIVES);
    setScore(0);
    setStreak(0);
    nextQuestion();
  };

  const answer = useCallback(
    (name) => {
      if (phase !== 'guess') return;
      clearTimeout(countdownRef.current);
      setPicked(name);
      setPhase('reveal');

      const correct = name === q.answer.name;
      const nextLives = correct ? lives : lives - 1;
      if (correct) {
        setScore((s) => s + 1);
        setStreak((s) => {
          const ns = s + 1;
          if (ns > best) {
            setBest(ns);
            localStorage.setItem('whosthat-best', String(ns));
          }
          return ns;
        });
      } else {
        setStreak(0);
        setLives(nextLives);
      }

      advanceRef.current = setTimeout(() => {
        if (nextLives <= 0) setPhase('over');
        else nextQuestion();
      }, 2000);
    },
    [phase, q, lives, best, nextQuestion]
  );

  // Per-question countdown — timeout counts as a wrong answer
  useEffect(() => {
    if (phase !== 'guess') return;
    countdownRef.current = setTimeout(() => answer(null), TIME_LIMIT * 1000);
    return () => clearTimeout(countdownRef.current);
  }, [phase, roundNum]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => () => {
      clearTimeout(countdownRef.current);
      clearTimeout(advanceRef.current);
    },
    []
  );

  const correct = picked === q?.answer?.name;

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/arcade" className="neo-sticker bg-neo-white inline-block mb-4 hover:bg-neo-yellow">
        ← Arcade
      </Link>

      <div className="relative border-4 border-neo-black bg-neo-blue shadow-neo-xl overflow-hidden">
        {/* floating question marks */}
        {phase === 'guess' &&
          ['8%', '85%', '70%', '15%'].map((left, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -14, 0], rotate: [0, i % 2 ? 12 : -12, 0] }}
              transition={{ repeat: Infinity, duration: 2.2 + i * 0.4 }}
              className="absolute font-display text-4xl text-neo-white/30 select-none"
              style={{ left, top: `${15 + i * 18}%` }}
              aria-hidden="true"
            >
              ?
            </motion.span>
          ))}

        {phase === 'intro' && (
          <div className="relative px-6 py-16 text-center text-neo-white">
            <motion.div
              animate={{ rotate: [0, -6, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="font-display text-7xl mb-4"
            >
              ?
            </motion.div>
            <h1 className="text-3xl md:text-5xl uppercase [text-shadow:4px_4px_0_#16161A]">
              Who&apos;s that Pokémon?
            </h1>
            <p className="mt-4 font-mono font-bold text-sm max-w-md mx-auto">
              Name the silhouette before the clock runs out. {MAX_LIVES} lives —
              build the longest streak you can! Best streak: {best}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="neo-button bg-neo-yellow text-neo-black text-lg mt-8"
            >
              👀 Start guessing
            </motion.button>
          </div>
        )}

        {(phase === 'guess' || phase === 'reveal') && q && (
          <div className="relative px-4 py-6">
            {/* HUD */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-1 text-xl">
                {Array.from({ length: MAX_LIVES }).map((_, i) => (
                  <motion.span key={i} animate={{ scale: i < lives ? 1 : 0.7 }} className={i < lives ? '' : 'grayscale opacity-40'}>
                    ❤️
                  </motion.span>
                ))}
              </div>
              <span className="neo-sticker bg-neo-yellow text-neo-black text-sm">Score {score}</span>
              <span className="neo-sticker bg-neo-pink text-neo-black text-sm">🔥 {streak}</span>
            </div>

            {/* Timer bar */}
            <div className="h-3 border-2 border-neo-black bg-neo-white/30 mb-6 overflow-hidden">
              {phase === 'guess' && (
                <motion.div
                  key={roundNum}
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: TIME_LIMIT, ease: 'linear' }}
                  className="h-full bg-neo-yellow"
                />
              )}
            </div>

            {/* The silhouette */}
            <div className="relative mx-auto w-56 h-56 md:w-64 md:h-64 border-4 border-neo-black bg-neo-white rounded-tl-3xl flex items-center justify-center overflow-hidden">
              <Pokeball className="absolute -bottom-8 -right-8 w-32 h-32 opacity-10" />
              <AnimatePresence>
                {phase === 'reveal' && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`absolute inset-0 ${correct ? 'bg-neo-green' : 'bg-neo-red'}`}
                  />
                )}
              </AnimatePresence>
              <motion.img
                key={roundNum}
                src={artUrl(q.answer.id)}
                alt="Mystery Pokémon"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-48 h-48 md:w-56 md:h-56 object-contain relative transition-[filter] duration-500"
                style={{ filter: phase === 'guess' ? 'brightness(0)' : 'none' }}
                draggable="false"
              />
            </div>

            {/* Verdict sticker */}
            <div className="h-12 mt-4 text-center">
              <AnimatePresence>
                {phase === 'reveal' && (
                  <motion.span
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: -3 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`neo-sticker text-base md:text-xl ${
                      correct ? 'bg-neo-green text-neo-black' : 'bg-neo-red text-neo-white'
                    }`}
                  >
                    {correct ? `It's ${q.answer.name.toUpperCase()}! 🎉` : `It was ${q.answer.name.toUpperCase()}…`}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3 mt-2 max-w-md mx-auto">
              {q.options.map((opt, i) => {
                const isAnswer = opt.name === q.answer.name;
                const isPicked = opt.name === picked;
                return (
                  <motion.button
                    key={opt.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={
                      phase === 'reveal' && isPicked && !correct
                        ? { y: 0, opacity: 1, x: [0, -6, 6, -4, 4, 0] }
                        : { y: 0, opacity: 1 }
                    }
                    transition={{ delay: phase === 'guess' ? i * 0.07 : 0 }}
                    whileHover={phase === 'guess' ? { scale: 1.04, rotate: i % 2 ? 1 : -1 } : undefined}
                    whileTap={phase === 'guess' ? { scale: 0.95 } : undefined}
                    onClick={() => answer(opt.name)}
                    disabled={phase !== 'guess'}
                    className={`px-3 py-3 border-2 border-neo-black font-bold uppercase text-sm shadow-neo transition-colors
                      ${
                        phase === 'reveal'
                          ? isAnswer
                            ? 'bg-neo-green'
                            : isPicked
                              ? 'bg-neo-red text-neo-white'
                              : 'bg-neo-white opacity-50'
                          : 'bg-neo-white hover:bg-neo-yellow'
                      }`}
                  >
                    {opt.name.replace(/-/g, ' ')}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {phase === 'over' && (
          <div className="relative px-6 py-16 text-center text-neo-white">
            <motion.h2
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 150 }}
              className="text-4xl md:text-6xl uppercase text-neo-yellow [text-shadow:4px_4px_0_#16161A]"
            >
              Game over!
            </motion.h2>
            <p className="mt-6 font-display text-2xl">Score: {score}</p>
            <p className="mt-2 font-mono font-bold text-sm">Best streak ever: {best} 🔥</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="neo-button bg-neo-yellow text-neo-black text-lg mt-8"
            >
              🔄 Play again
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhosThat;
