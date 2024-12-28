/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPokemonSpecies, getEvolutionChain, getPokemonDetails } from '../../utils/api';
import Loading from "../ui/Loading";

const EvolutionChain = ({ pokemonId }) => {
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvolutionChain = async () => {
      try {
        const species = await getPokemonSpecies(pokemonId);
        const evolutionData = await getEvolutionChain(species.evolution_chain.url);

        const chain = [];
        let current = evolutionData.chain;

        while (current) {
          const pokemonId = current.species.url.split('/')[6];
          const pokemonDetails = await getPokemonDetails(pokemonId);

          chain.push({
            id: pokemonId,
            name: current.species.name,
            image: pokemonDetails.sprites.other['official-artwork'].front_default
          });

          current = current.evolves_to[0];
        }

        setEvolutionChain(chain);
      } catch (error) {
        console.error('Error fetching evolution chain:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvolutionChain();
  }, [pokemonId]);

  if (loading) return <Loading />;

  if (evolutionChain.length == 0) return;

  else
    return (
      <div className="mt-8 neo-card p-6">
        <h3 className="text-2xl font-bold mb-4">Evolution Chain</h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {evolutionChain.map((pokemon, index) => (
            <div key={pokemon.id} className="flex items-center">
              <div
                onClick={() => navigate(`/pokemon/${pokemon.id}`)}
                className="cursor-pointer hover:scale-105 transition-transform"
              >
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="w-32 h-32 object-contain"
                />
                <p className="text-center capitalize font-bold">{pokemon.name}</p>
              </div>
              {index < evolutionChain.length - 1 && (
                <div className="mx-4 text-2xl font-bold">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
};

export default EvolutionChain;