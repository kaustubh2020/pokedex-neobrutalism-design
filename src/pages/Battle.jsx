import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getPokemonDetails } from '../utils/api';
import { getTypeEffectiveness } from '../utils/typeEffectiveness';
import BattleCard, { CardBack } from '../components/battle/BattleCard';
import { STAT_KEYS, getStat } from '../components/battle/battleUtils';
import Pokeball from '../components/ui/Pokeball';
import Loading from '../components/ui/Loading';

const HAND_SIZE = 5;
const WINS_NEEDED = 3;
const GEN1_MAX = 151; // classic cartoon-era Pokémon only

const drawIds = (count) => {
  const ids = new Set();
  while (ids.size < count) ids.add(1 + Math.floor(Math.random() * GEN1_MAX));
  return [...ids];
};

// Type-effectiveness bonus: super effective +25%, not very −20%, immune −30%
const typeBoost = (attacker, defender) => {
  const mult = getTypeEffectiveness(defender.types.map((t) => t.type.name))[
    attacker.types[0].type.name
  ];
  if (mult > 1) return { factor: 1.25, label: 'SUPER EFFECTIVE!' };
  if (mult === 0) return { factor: 0.7, label: 'NO EFFECT…' };
  if (mult < 1) return { factor: 0.8, label: 'NOT VERY EFFECTIVE' };
  return { factor: 1, label: null };
};

// CPU "mood" — an honest tell about its best card for the announced stat,
// so a sharp player can bluff-play a weak card when the CPU looks scary
const cpuMood = (hand, statKey) => {
  const best = Math.max(...hand.map((c) => getStat(c, statKey)));
  if (best >= 110) return { emoji: '😤', line: 'The CPU looks VERY confident…' };
  if (best >= 80) return { emoji: '🙂', line: 'The CPU seems comfortable.' };
  return { emoji: '😬', line: 'The CPU looks nervous!' };
};

/** Number that counts up from 0 with an ease-out curve. */
const CountUp = ({ value, className }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start;
    let raf;
    const step = (t) => {
      if (start === undefined) start = t;
      const p = Math.min((t - start) / 700, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span className={className}>{display}</span>;
};

CountUp.propTypes = {
  value: PropTypes.number.isRequired,
  className: PropTypes.string,
};

const Starburst = () => (
  <motion.svg
    viewBox="0 0 100 100"
    initial={{ scale: 0, rotate: -30, opacity: 0 }}
    animate={{ scale: 1.6, rotate: 15, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 250, damping: 14 }}
    className="absolute inset-0 m-auto w-28 h-28 md:w-36 md:h-36 pointer-events-none"
    aria-hidden="true"
  >
    <polygon
      points="50,0 61,35 95,28 70,55 92,80 58,70 50,100 42,70 8,80 30,55 5,28 39,35"
      fill="#FFDE00"
      stroke="#16161A"
      strokeWidth="2"
    />
  </motion.svg>
);

const ScorePips = ({ score, color }) => (
  <div className="flex gap-1.5">
    {Array.from({ length: WINS_NEEDED }).map((_, i) =>
      i < score ? (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          className={`w-6 h-6 border-2 border-neo-black rounded-full ${color}`}
        />
      ) : (
        <div key={i} className="w-6 h-6 border-2 border-neo-black rounded-full bg-neo-white/30" />
      )
    )}
  </div>
);

ScorePips.propTypes = {
  score: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

const Battle = () => {
  const [phase, setPhase] = useState('intro'); // intro | loading | pick | clash | over
  const [playerHand, setPlayerHand] = useState([]);
  const [cpuHand, setCpuHand] = useState([]);
  const [round, setRound] = useState(1);
  const [stat, setStat] = useState(STAT_KEYS[0]);
  const [scores, setScores] = useState({ player: 0, cpu: 0 });
  const [clash, setClash] = useState(null);
  const [revealed, setRevealed] = useState(false);
  // stat roulette: cycles labels before locking the round's stat
  const [rolling, setRolling] = useState(false);
  const [displayStat, setDisplayStat] = useState(STAT_KEYS[0]);

  const startGame = useCallback(async () => {
    setPhase('loading');
    setScores({ player: 0, cpu: 0 });
    setRound(1);
    setClash(null);
    try {
      const cards = await Promise.all(
        drawIds(HAND_SIZE * 2).map((id) => getPokemonDetails(String(id)))
      );
      setPlayerHand(cards.slice(0, HAND_SIZE));
      setCpuHand(cards.slice(HAND_SIZE));
      setStat(STAT_KEYS[Math.floor(Math.random() * STAT_KEYS.length)]);
      setPhase('pick');
    } catch (err) {
      console.error('Failed to deal cards:', err);
      setPhase('intro');
    }
  }, []);

  // Spin the stat roulette at the start of every pick phase
  useEffect(() => {
    if (phase !== 'pick') return;
    setRolling(true);
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      setDisplayStat(STAT_KEYS[i % STAT_KEYS.length]);
    }, 90);
    const to = setTimeout(() => {
      clearInterval(iv);
      setDisplayStat(stat);
      setRolling(false);
    }, 1100);
    return () => {
      clearInterval(iv);
      clearTimeout(to);
    };
  }, [phase, stat, round]);

  const playCard = (card) => {
    if (phase !== 'pick' || rolling) return;

    // CPU AI: plays its best card for the stat only 40% of the time —
    // the rest is guesswork, same as you
    const sorted = [...cpuHand].sort((a, b) => getStat(b, stat.key) - getStat(a, stat.key));
    const cpuCard = Math.random() < 0.4 ? sorted[0] : sorted[Math.floor(Math.random() * sorted.length)];

    const pBoost = typeBoost(card, cpuCard);
    const cBoost = typeBoost(cpuCard, card);
    const pVal = Math.round(getStat(card, stat.key) * pBoost.factor);
    const cVal = Math.round(getStat(cpuCard, stat.key) * cBoost.factor);

    setPlayerHand((h) => h.filter((c) => c.id !== card.id));
    setCpuHand((h) => h.filter((c) => c.id !== cpuCard.id));
    setClash({
      playerCard: card,
      cpuCard,
      pVal,
      cVal,
      pBoost,
      cBoost,
      // ties go to the trainer — you earned it
      winner: pVal >= cVal ? 'player' : 'cpu',
      tie: pVal === cVal,
    });
    setRevealed(false);
    setPhase('clash');
    setTimeout(() => setRevealed(true), 900);
  };

  // Apply score once the clash is revealed
  useEffect(() => {
    if (phase === 'clash' && revealed && clash) {
      setScores((s) => ({ ...s, [clash.winner]: s[clash.winner] + 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);

  const nextRound = () => {
    if (phase !== 'clash' || !revealed) return; // ignore ghost/double clicks
    const decided =
      scores.player >= WINS_NEEDED || scores.cpu >= WINS_NEEDED || playerHand.length === 0;
    if (decided) {
      setPhase('over');
    } else {
      setRound((r) => r + 1);
      setStat(STAT_KEYS[Math.floor(Math.random() * STAT_KEYS.length)]);
      setClash(null);
      setPhase('pick');
    }
  };

  const finalVerdict =
    scores.player === scores.cpu ? 'draw' : scores.player > scores.cpu ? 'player' : 'cpu';

  const mood = cpuHand.length > 0 ? cpuMood(cpuHand, stat.key) : null;

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/arcade" className="neo-sticker bg-neo-white inline-block mb-4 hover:bg-neo-yellow">
        ← Arcade
      </Link>

      {/* Arena shell — dark stadium against the cream site */}
      <div className="relative border-4 border-neo-black bg-neo-black text-neo-white shadow-neo-xl overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(#FFDE00 1.5px, transparent 1.5px)',
            backgroundSize: '18px 18px',
          }}
        />
        <div className="absolute inset-0 arena-stripes" />

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="relative px-6 py-16 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 150 }}>
              <Pokeball className="w-24 h-24 mx-auto mb-6 animate-float" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl uppercase text-neo-yellow [text-shadow:4px_4px_0_#EE1515]">
              Stat Clash
            </h1>
            <p className="mt-4 font-mono font-bold max-w-md mx-auto text-sm md:text-base">
              5 cards each. A stat is announced — play your strongest card. Type
              advantage boosts your number, ties go to YOU, and watch the CPU&apos;s
              mood for a tell. First to {WINS_NEEDED} wins!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="neo-button bg-neo-red text-lg mt-8 shadow-neo-white"
            >
              ⚔️ Deal me in
            </motion.button>
          </div>
        )}

        {phase === 'loading' && (
          <div className="relative text-neo-white [&_p]:text-neo-yellow py-10">
            <Loading label="Shuffling the deck…" />
          </div>
        )}

        {/* ---------- BATTLE ---------- */}
        {(phase === 'pick' || phase === 'clash') && (
          <div className="relative px-4 py-6">
            {/* Scoreboard */}
            <div className="flex items-center justify-between mb-6 gap-3">
              <div className="flex flex-col items-start gap-1">
                <span className="neo-sticker bg-neo-blue text-neo-white text-xs">You</span>
                <ScorePips score={scores.player} color="bg-neo-blue" />
              </div>
              <div className="text-center">
                <div className="font-display uppercase text-neo-yellow text-sm">Round {round}</div>
                <motion.div
                  key={stat.key + round}
                  animate={rolling ? { rotate: [-3, 3, -3] } : { scale: [1.3, 1], rotate: -3 }}
                  transition={rolling ? { repeat: Infinity, duration: 0.25 } : { type: 'spring', stiffness: 300 }}
                  className={`neo-sticker text-base md:text-xl mt-1 ${
                    rolling ? 'bg-neo-white text-neo-black' : 'bg-neo-yellow text-neo-black'
                  }`}
                >
                  {displayStat.icon} {displayStat.label} CLASH
                </motion.div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="neo-sticker bg-neo-red text-neo-white text-xs">CPU</span>
                <ScorePips score={scores.cpu} color="bg-neo-red" />
              </div>
            </div>

            {/* CPU hand (face down) + mood tell */}
            <div className="flex justify-center gap-2 mb-2">
              {cpuHand.map((c) => (
                <motion.div key={c.id} layout animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2, delay: c.id % 5 * 0.2 }}>
                  <CardBack small />
                </motion.div>
              ))}
            </div>
            <div className="h-6 mb-4 text-center">
              {phase === 'pick' && !rolling && mood && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono text-xs md:text-sm text-neo-white/80"
                >
                  {mood.emoji} {mood.line}
                </motion.p>
              )}
            </div>

            {/* Clash zone */}
            {phase === 'clash' && clash && (
              <motion.div
                key="clash"
                initial={{ opacity: 0 }}
                animate={revealed ? { opacity: 1, x: [0, -10, 10, -6, 6, 0] } : { opacity: 1 }}
                transition={revealed ? { duration: 0.45 } : undefined}
                className="mb-6"
              >
                <div className="flex items-center justify-center gap-3 md:gap-10">
                  {/* Player side */}
                  <motion.div initial={{ x: -120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-center">
                    <div
                      className={`transition-all duration-500 ${
                        revealed && !clash.tie
                          ? clash.winner === 'player'
                            ? 'winner-card'
                            : 'loser-card'
                          : ''
                      }`}
                    >
                      <BattleCard pokemon={clash.playerCard} highlightStat={stat.key} />
                    </div>
                    <AnimatePresence>
                      {revealed && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                          <CountUp value={clash.pVal} className="font-display text-3xl text-neo-blue" />
                          {clash.pBoost.label && (
                            <motion.div
                              initial={{ scale: 0, rotate: -8 }}
                              animate={{ scale: 1, rotate: -3 }}
                              transition={{ delay: 0.5, type: 'spring' }}
                              className="text-[10px] font-bold text-neo-yellow"
                            >
                              {clash.pBoost.label}
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* VS / verdict */}
                  <div className="relative text-center w-24 md:w-32 shrink-0">
                    {!revealed ? (
                      <motion.span
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                        className="font-display text-3xl md:text-5xl text-neo-yellow"
                      >
                        VS
                      </motion.span>
                    ) : (
                      <>
                        <Starburst />
                        <motion.div
                          initial={{ scale: 3, opacity: 0, rotate: 8 }}
                          animate={{ scale: 1, opacity: 1, rotate: -4 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                          className="relative"
                        >
                          <span
                            className={`neo-sticker text-sm md:text-lg ${
                              clash.winner === 'player'
                                ? 'bg-neo-green text-neo-black'
                                : 'bg-neo-red text-neo-white'
                            }`}
                          >
                            {clash.tie ? 'TIE — YOU TAKE IT!' : clash.winner === 'player' ? 'YOU WIN!' : 'CPU WINS'}
                          </span>
                        </motion.div>
                      </>
                    )}
                  </div>

                  {/* CPU side: face-down until reveal */}
                  <motion.div initial={{ x: 120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-center">
                    {revealed ? (
                      <motion.div initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} transition={{ duration: 0.3 }}>
                        <div
                          className={`transition-all duration-500 ${
                            !clash.tie
                              ? clash.winner === 'cpu'
                                ? 'winner-card'
                                : 'loser-card'
                              : ''
                          }`}
                        >
                          <BattleCard pokemon={clash.cpuCard} highlightStat={stat.key} />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div animate={{ rotate: [-1, 1, -1] }} transition={{ repeat: Infinity, duration: 0.3 }}>
                        <CardBack />
                      </motion.div>
                    )}
                    <AnimatePresence>
                      {revealed && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                          <CountUp value={clash.cVal} className="font-display text-3xl text-neo-red" />
                          {clash.cBoost.label && (
                            <motion.div
                              initial={{ scale: 0, rotate: 8 }}
                              animate={{ scale: 1, rotate: 3 }}
                              transition={{ delay: 0.5, type: 'spring' }}
                              className="text-[10px] font-bold text-neo-yellow"
                            >
                              {clash.cBoost.label}
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {revealed && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-4"
                  >
                    <button onClick={nextRound} className="neo-button bg-neo-yellow text-neo-black shadow-neo-white">
                      {scores.player >= WINS_NEEDED || scores.cpu >= WINS_NEEDED || playerHand.length === 0
                        ? '🏆 Final result'
                        : 'Next round ▶'}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Player hand */}
            {phase === 'pick' && (
              <p className="text-center font-mono font-bold text-neo-yellow mb-3 text-sm min-h-5">
                {rolling ? '🎰 Rolling the stat…' : `▼ Pick your fighter for the ${stat.label} clash ▼`}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-3">
              {playerHand.map((c) => (
                <motion.div key={c.id} layout>
                  <BattleCard
                    pokemon={c}
                    highlightStat={rolling ? null : stat.key}
                    onClick={() => playCard(c)}
                    disabled={phase !== 'pick' || rolling}
                    dimmed={phase === 'clash'}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ---------- GAME OVER ---------- */}
        {phase === 'over' && (
          <div className="relative px-6 py-16 text-center overflow-hidden">
            {/* falling pokéballs */}
            {finalVerdict === 'player' &&
              Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -60, x: 0, opacity: 0 }}
                  animate={{ y: 500, opacity: [0, 1, 1, 0], rotate: 360 }}
                  transition={{ duration: 2.5, delay: i * 0.18, repeat: Infinity, repeatDelay: 1 }}
                  className="absolute top-0"
                  style={{ left: `${6 + i * 8}%` }}
                >
                  <Pokeball className="w-8 h-8" />
                </motion.div>
              ))}

            <motion.h2
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 150 }}
              className={`text-4xl md:text-6xl uppercase relative ${
                finalVerdict === 'player'
                  ? 'text-neo-green [text-shadow:4px_4px_0_#16161A]'
                  : finalVerdict === 'cpu'
                    ? 'text-neo-red [text-shadow:4px_4px_0_#FFFFFF]'
                    : 'text-neo-yellow'
              }`}
            >
              {finalVerdict === 'player' ? 'You won!' : finalVerdict === 'cpu' ? 'CPU wins!' : 'Draw!'}
            </motion.h2>
            <p className="mt-4 font-display text-2xl text-neo-white relative">
              {scores.player} — {scores.cpu}
            </p>
            <p className="mt-2 font-mono font-bold text-sm relative">
              {finalVerdict === 'player'
                ? 'A true Pokémon Master! 🏆'
                : finalVerdict === 'cpu'
                  ? 'The CPU got lucky. Demand a rematch!'
                  : 'Perfectly balanced. Run it back!'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="neo-button bg-neo-red text-lg mt-8 shadow-neo-white relative"
            >
              🔄 Rematch
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Battle;
