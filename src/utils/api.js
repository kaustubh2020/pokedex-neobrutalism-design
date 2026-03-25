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

const detailsCache = new Map();

export const getPokemonDetails = async (id) => {
  if (detailsCache.has(id)) return detailsCache.get(id);
  const data = await fetchData(`${BASE_URL}/pokemon/${id}`);
  detailsCache.set(id, data);
  return data;
};

const speciesCache = new Map();

export const getPokemonSpecies = async (id) => {
  if (speciesCache.has(id)) return speciesCache.get(id);
  const data = await fetchData(`${BASE_URL}/pokemon-species/${id}`);
  speciesCache.set(id, data);
  return data;
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

const moveCache = new Map();

export const getMoveDetails = async (url) => {
  if (moveCache.has(url)) {
    return moveCache.get(url);
  }

  try {
    const data = await fetchData(url);
    moveCache.set(url, data);
    return data;
  } catch (error) {
    console.error("Error fetching move details:", error);
    throw error;
  }
};
