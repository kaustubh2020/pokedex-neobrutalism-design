import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "motion/react";
import { typeColors } from '../utils/typeColors';
import { getPokemonDetails } from '../utils/api';
import Loading from '../components/ui/Loading';
import EvolutionChain from '../components/pokemon/EvolutionChain';

const PokemonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const data = await getPokemonDetails(id);
        setPokemon(data);
      } catch (error) {
        console.error('Error fetching pokemon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  if (loading || !pokemon) return <Loading />;

  const mainType = pokemon.types[0].type.name;
  const colors = typeColors[mainType];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="neo-card p-8" style={{ backgroundColor: colors.highlight }}>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="neo-button mb-6"
        >
          ← Back to List
        </motion.button>

        <div className="grid md:grid-cols-2 gap-8">
          <div
            className="neo-card p-4 bg-neo-white rounded-tl-3xl"
          >
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={pokemon.name}
              className="w-full h-auto"
            />
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <motion.h1
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-black uppercase"
              >
                {pokemon.name}
              </motion.h1>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold"
              >
                #{String(pokemon.id).padStart(3, '0')}
              </motion.span>
            </div>

            <div className="flex gap-2">
              <AnimatePresence>
                {pokemon.types.map(({ type }, index) => (
                  <motion.span
                    key={type.name}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="px-4 py-2 border-2 border-neo-black font-bold uppercase"
                    style={{ backgroundColor: typeColors[type.name].bg }}
                  >
                    {type.name}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="neo-card p-4"
                >
                  <h3 className="font-bold">Height</h3>
                  <p>{pokemon.height / 10} m</p>
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="neo-card p-4"
                >
                  <h3 className="font-bold">Weight</h3>
                  <p>{pokemon.weight / 10} kg</p>
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="neo-card p-4"
              >
                <h3 className="font-bold mb-2">Stats</h3>
                <div className="space-y-2">
                  <AnimatePresence>
                    {pokemon.stats.map((stat, index) => (
                      <motion.div
                        key={stat.stat.name}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-1"
                      >
                        <div className="flex justify-between">
                          <span className="capitalize">{stat.stat.name}</span>
                          <span>{stat.base_stat}</span>
                        </div>
                        <div className="h-4 bg-neo-white border-2 border-neo-black">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(stat.base_stat / 255) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-full rounded-r-full"
                            style={{ backgroundColor: colors.highlight }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="neo-card p-4"
              >
                <h3 className="font-bold mb-2">Abilities</h3>
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {pokemon.abilities.map(({ ability }, index) => (
                      <motion.span
                        key={ability.name}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-3 py-1 neo-card capitalize"
                      >
                        {ability.name.replace('-', ' ')}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <EvolutionChain pokemonId={pokemon.id} />
      </div>
    </motion.div>
  );
};

export default PokemonDetail;