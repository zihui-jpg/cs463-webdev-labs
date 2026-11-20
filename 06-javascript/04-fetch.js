const pokemonColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#ea7ce8",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

// Add your code here

const pokeList = document.querySelector(".poke-list");
const searchBar = document.querySelector("#search");

let pokemonList = [];

const createNewElement = function (data) {
  const { name: pokemonName, types, id } = data;
  const pokemonTypesArr = types.map((item) => item.type.name);

  const card = document.createElement("div");
  const h2 = document.createElement("h2");
  const img = document.createElement("img");
  const typesDiv = document.createElement("div");

  h2.textContent = pokemonName;
  img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  img.alt = `${pokemonName}`;
  img.width = "240";
  img.height = "240";

  pokemonTypesArr.map((item) => {
    const span = document.createElement("span");
    span.textContent = item;
    span.style.backgroundColor = pokemonColors[item];
    span.setAttribute("class", "pokemonType");
    typesDiv.append(span);
  });

  card.append(h2, img, typesDiv);
  card.setAttribute("class", "pokemonCard");
  return card;
};

const fetchData = async function () {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=25&offset=0";

  try {
    const response = await fetch(url);
    const data = await response.json();

    const pokemonRetrieve = data.results;

    const promises = pokemonRetrieve.map((pokemon) =>
      fetch(pokemon.url).then((response) => response.json()),
    );

    pokemonList = await Promise.all(promises);

    searchPokemon(pokemonList);

    searchBar.addEventListener("input", processSearch);
  } catch (error) {
    console.error("Error fetch data from the PokeAPI", error);
    const errorElement = document.createElement("p");

    errorElement.textContent = "Error fetching data from the PokeAPI";
    errorElement.setAttribute("class", "errorMessage");
    pokeList.append(errorElement);
  } finally {
    console.log("executes either way");
    const loading = document.querySelector(".loading-container");
    loading.setAttribute("class", "display-none");
  }
};

const searchPokemon = function (list) {
  pokeList.textContent = "";

  if (list.length === 0) {
    const message = document.createElement("p");
    message.textContent =
      "Sorry, there is nothing that matched with the request.";
    message.classList.add("errorMessage");
    pokeList.append(message);
    return;
  }

  list.forEach((pokemon) => pokeList.append(createNewElement(pokemon)));
};

const processSearch = function () {
  const query = searchBar.value.trim().toLowerCase();
  const results = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(query),
  );
  searchPokemon(results);
};

fetchData();
