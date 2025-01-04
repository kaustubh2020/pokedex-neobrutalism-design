const BASE_URL = "https://pokeapi.co/api/v2";

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const getPokemonDetails = async (id) => {
  return await fetchData(`${BASE_URL}/pokemon/${id}`);
};

export const getPokemonSpecies = async (id) => {
  return await fetchData(`${BASE_URL}/pokemon-species/${id}`);
};

const evolutionCache = new Map();

export const getEvolutionChain = async (url) => {
  if (evolutionCache.has(url)) {
    return evolutionCache.get(url);
  }

  try {
    const data = await fetchData(url);
    evolutionCache.set(url, data);
    return data;
  } catch (error) {
    console.error("Error fetching evolution chain:", error);
    throw error;
  }
};
