import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    // Fetch the list of all Pokémon from PokeAPI
    const result = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=10000");
    const pokemonList = result.data.results;

    // Pick a random Pokémon from the list
    const randomIndex = Math.floor(Math.random() * pokemonList.length);
    const randomPokemon = pokemonList[randomIndex];

    // Fetch a Pokémon card image using the Pokémon TCG API
    const tcgResponse = await axios.get(`https://api.pokemontcg.io/v2/cards?q=name:${randomPokemon.name}`);
    
    if (tcgResponse.data.data.length > 0) {
      const pokemonCard = tcgResponse.data.data[0]; // Get the first card that matches
      res.render("index.ejs", {
        pokemonName: pokemonCard.name,
        pokemonCardImage: pokemonCard.images.large, // Pokémon card image
      });
    } else {
      // Fetch Pokémon details from PokeAPI if no card image is found
      const pokemonDetails = await axios.get(randomPokemon.url);
      res.render("index.ejs", {
        pokemonName: pokemonDetails.data.name,
        pokemonCardImage: pokemonDetails.data.sprites.front_default, // Fallback to basic image
      });
    }

  } catch (error) {
    console.log(error.message);
    res.status(500).send("An error occurred");
  }
});



app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
