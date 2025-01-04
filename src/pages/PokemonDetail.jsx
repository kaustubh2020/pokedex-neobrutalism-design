import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from "motion/react"
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
          <div className="neo-card p-4 bg-neo-white rounded-tl-3xl">
            <img
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={pokemon.name}
              className="w-full h-auto"
            />
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-black uppercase">{pokemon.name}</h1>
              <span className="text-2xl font-bold">#{String(pokemon.id).padStart(3, '0')}</span>
            </div>

            <div className="flex gap-2">
              {pokemon.types.map(({ type }) => (
                <span
                  key={type.name}
                  className="px-4 py-2 border-2 border-neo-black font-bold uppercase"
                  style={{ backgroundColor: typeColors[type.name].bg }}
                >
                  {type.name}
                </span>
              ))}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="neo-card p-4">
                  <h3 className="font-bold">Height</h3>
                  <p>{pokemon.height / 10} m</p>
                </div>
                <div className="neo-card p-4">
                  <h3 className="font-bold">Weight</h3>
                  <p>{pokemon.weight / 10} kg</p>
                </div>
              </div>

              <div className="neo-card p-4">
                <h3 className="font-bold mb-2">Stats</h3>
                <div className="space-y-2">
                  {pokemon.stats.map(stat => (
                    <div key={stat.stat.name} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="capitalize">{stat.stat.name}</span>
                        <span>{stat.base_stat}</span>
                      </div>
                      <div className="h-4 bg-neo-white border-2 border-neo-black">
                        <div
                          className="h-full rounded-r-full"
                          style={{
                            width: `${(stat.base_stat / 255) * 100}%`,
                            backgroundColor: colors.highlight
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="neo-card p-4">
                <h3 className="font-bold mb-2">Abilities</h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map(({ ability }) => (
                    <span
                      key={ability.name}
                      className="px-3 py-1 neo-card capitalize"
                    >
                      {ability.name.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <EvolutionChain pokemonId={pokemon.id} />
      </div>
    </motion.div>
  );
};

export default PokemonDetail;